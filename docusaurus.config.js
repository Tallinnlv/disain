// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';
import path from 'path';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Tallinn Design System',
  tagline: 'Documentation for the Tallinn Design System',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://disain.tallinn.ee/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  staticDirectories: ['static', 'src/css/tds-library/css'],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          breadcrumbs: false,
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          path: 'docs',
          routeBasePath: 'docs',
          includeCurrentVersion: true,
          versions: {
            current: {
              label: 'Canary 🚧',
            },
            '1.0.0': {
              label: '1.0.0',
            },
            '2.0.0': {
              label: '2.0.0',
            },
          },
          lastVersion: '2.0.0', // Set this to the version you want as default (e.g., "1.0.0")
        },
        theme: {
          customCss: [require.resolve('./src/css/custom.scss')],
        },
        gtag: {
          trackingID: 'G-HRKQYX7956',
          anonymizeIP: true,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/tallinn_logo.svg',
      navbar: {
        logo: {
          alt: 'Tallinn',
          src: 'img/tds-logo.svg',
          href: '/',
          target: '_self',
          srcDark: 'img/tds-logo-dark.svg',
          className: 'navbar__logo-with-badge',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'gettingStarted',
            position: 'right',
            label: 'Getting started',
          },
          {
            to: 'docs/foundations',
            label: 'Foundations',
            type: 'docSidebar',
            sidebarId: 'foundations',
            position: 'right',
          },
          {
            to: 'docs/components',
            label: 'Components',
            type: 'docSidebar',
            sidebarId: 'components',
            position: 'right',
          },
          {
            to: 'docs/patterns',
            label: 'Patterns',
            type: 'docSidebar',
            sidebarId: 'patterns',
            position: 'right',
          },
          {
            type: 'docsVersionDropdown',
            position: 'right',
            dropdownActiveClassDisabled: true,
          },
          // {
          //   href: "https://github.com/facebook/docusaurus",
          //   label: "GitHub",
          //   position: "right",
          // },
        ],
      },

      footer: {
        style: 'light',
        links: [
          {
            title: 'Tallinn Design System',
            items: [
              {
                label: 'Getting started',
                to: 'docs/getting-started',
              },
              {
                label: 'Foundations',
                to: 'docs/foundations',
              },
              {
                label: 'Components',
                to: 'docs/components',
              },
              {
                label: 'Patterns',
                to: 'docs/patterns',
              },
            ],
          },
        ],
        // copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: true,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      liveCodeBlock: {
        /**
         * The position of the live playground, above or under the editor
         * Possible values: "top" | "bottom"
         */
        playgroundPosition: 'bottom',
      },
    }),
  plugins: [
    '@docusaurus/theme-live-codeblock',
    'docusaurus-plugin-sass',
    [
      path.resolve(__dirname, './plugins/tds-watcher-plugin'),
      {
        filePath: path.resolve(
          __dirname,
          'src/css/tds-library/css/tds-next.min.css',
        ),
      },
    ],
  ],
};

export default config;
