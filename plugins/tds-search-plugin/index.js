const fs = require('fs');
const path = require('path');

// Builds one search index file per docs version from the loaded docs
// content. The client (src/components/SiteSearch) lazy-loads the file for
// the version it is searching, so no index data ends up in every page.

const CATEGORY_BY_DIR = {
  components: 'Component',
  foundations: 'Foundation',
  patterns: 'Pattern',
  'getting-started': 'Getting started',
};

const MAX_TEXT_LENGTH = 4000;

// Removes `{ ... }` expressions (JSX props, inline expressions, comments)
// with a balanced-brace scan so multi-line example props disappear whole.
function stripBraceExpressions(input) {
  let out = '';
  let depth = 0;
  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    if (ch === '{') {
      depth += 1;
    } else if (ch === '}') {
      if (depth > 0) depth -= 1;
    } else if (depth === 0) {
      out += ch;
    }
  }
  return out;
}

function collectHeadings(source) {
  const headings = [];
  const re = /^#{2,3}\s+(.+?)\s*$/gm;
  let match;
  while ((match = re.exec(source)) !== null) {
    headings.push(match[1].replace(/[`*_]/g, '').trim());
  }
  return headings;
}

function mdxToText(source) {
  let text = source;
  text = text.replace(/^---[\s\S]*?^---\s*/m, ''); // frontmatter
  text = text.replace(/```[\s\S]*?```/g, ' '); // fenced code
  text = text.replace(/^\s*(import|export)\b[\s\S]*?(;|\n\s*\n)/gm, ' ');
  text = stripBraceExpressions(text);
  text = text.replace(/<[^>]*>/g, ' '); // JSX / HTML tags
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, ' '); // images
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1'); // links -> label
  text = text.replace(/^\s{0,3}#{1,6}\s+/gm, ''); // heading markers
  text = text.replace(/^\s*[-*+]\s+/gm, ''); // list markers
  text = text.replace(/^\s*>\s?/gm, ''); // blockquotes
  text = text.replace(/^\s*\|.*\|\s*$/gm, (row) => row.replace(/\|/g, ' ')); // tables
  text = text.replace(/^\s*:?-{3,}:?\s*$/gm, ' ');
  text = text.replace(/[`*_~]/g, '');
  text = text.replace(/&nbsp;|&amp;|&quot;|&#39;/g, (e) =>
    ({ '&nbsp;': ' ', '&amp;': '&', '&quot;': '"', '&#39;': "'" })[e],
  );
  return text.replace(/\s+/g, ' ').trim();
}

// Component pages are stitched from `_overview.mdx`, `_usage.mdx`, ... via
// relative imports; their prose belongs to the page.
function readWithPartials(filePath, seen = new Set()) {
  if (seen.has(filePath) || !fs.existsSync(filePath)) return '';
  seen.add(filePath);
  const source = fs.readFileSync(filePath, 'utf8');
  const partials = [];
  const re = /^import\s+\w+\s+from\s+['"](\.\/[^'"]+\.mdx?)['"]/gm;
  let match;
  while ((match = re.exec(source)) !== null) {
    partials.push(path.resolve(path.dirname(filePath), match[1]));
  }
  return [source, ...partials.map((p) => readWithPartials(p, seen))].join(
    '\n\n',
  );
}

function categoryFor(doc) {
  const dir = (doc.sourceDirName || '').split('/')[0];
  return CATEGORY_BY_DIR[dir] || 'Page';
}

const GENERIC_TITLES = new Set(['Overview', 'Tokens', 'Usage guidelines']);

function humanize(slug) {
  return slug.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}

// "Foundations › Color" for foundations/color/color-overview; "Components"
// for components/components.
function breadcrumbFor(doc) {
  const parts = (doc.sourceDirName || '').split('/').filter(Boolean);
  const crumbs = [humanize(parts[0] || '')];
  if (parts.length >= 3) crumbs.push(humanize(parts[1]));
  return crumbs.filter(Boolean).join(' › ');
}

// Several pages carry a generic frontmatter title ("Overview") and put the
// real one in an <OverviewTemplate title="…"> prop or the H1, so prefer those.
function templateProps(raw) {
  const match = raw.match(/<OverviewTemplate\b([\s\S]*?)\/?>/);
  if (!match) return {};
  const props = {};
  const re = /(title|description)="([^"]*)"/g;
  let m;
  while ((m = re.exec(match[1])) !== null) props[m[1]] = m[2];
  return props;
}

function displayTitleFor(doc, raw) {
  const template = templateProps(raw);
  if (template.title) return template.title;
  const h1 = raw.match(/^#\s+(.+?)\s*$/m);
  if (h1 && !GENERIC_TITLES.has(h1[1].trim())) return h1[1].trim();
  if (GENERIC_TITLES.has(doc.title)) {
    const parts = (doc.sourceDirName || '').split('/').filter(Boolean);
    const parent = humanize(parts.length >= 3 ? parts[1] : parts[0] || '');
    return `${parent} ${doc.title.toLowerCase()}`.trim();
  }
  return doc.title;
}

module.exports = function tdsSearchPlugin(context) {
  const { siteDir } = context;

  return {
    name: 'tds-search-plugin',

    async allContentLoaded({ allContent, actions }) {
      const docsPlugin = allContent['docusaurus-plugin-content-docs'];
      const docsContent = docsPlugin && docsPlugin.default;
      if (!docsContent) return;

      await Promise.all(
        docsContent.loadedVersions.map(async (version) => {
          const records = version.docs
            .filter((doc) => doc.source && !doc.frontMatter?.hide_from_search)
            .map((doc) => {
              const filePath = doc.source.replace(/^@site\//, `${siteDir}/`);
              const raw = readWithPartials(filePath);
              const template = templateProps(raw);
              return {
                id: doc.id,
                title: displayTitleFor(doc, raw),
                description: template.description || doc.description || '',
                permalink: doc.permalink,
                category: categoryFor(doc),
                breadcrumb: breadcrumbFor(doc),
                headings: collectHeadings(raw),
                text: mdxToText(raw).slice(0, MAX_TEXT_LENGTH),
              };
            });

          await actions.createData(
            `index-${version.versionName}.json`,
            JSON.stringify(records),
          );
        }),
      );
    },
  };
};
