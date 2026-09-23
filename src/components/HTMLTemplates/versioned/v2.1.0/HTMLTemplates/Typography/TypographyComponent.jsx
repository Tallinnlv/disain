import { html } from '@site/src/utils/formatHtml';

/**
 * @param {object} props
 * @param {string} [props.content] - The content before the link
 * @param {string} [props.bodySize] - Size of body text
 * @param {string} [props.uiSize] - Size of UI text
 * @param {string} [props.headingSize] - Size of heading text
 * @param {number} [props.headingLevel] - Explicit heading level (1-6); overrides the level implied by headingSize
 */

function TypographyComponent({ bodySize, uiSize, headingSize, headingLevel, content }) {
  const className = headingSize
    ? headingSize === 'dp'
      ? 'tds-heading-dp'
      : headingSize === 'lg'
        ? 'tds-heading-lg'
        : headingSize === 'md'
          ? 'tds-heading-md'
          : headingSize === 'sm'
            ? 'tds-heading-sm'
            : headingSize === 'xs'
              ? 'tds-heading-xs'
              : 'tds-heading-md'
    : bodySize
      ? bodySize === 'lg'
        ? 'tds-body-lg'
        : bodySize === 'md'
          ? 'tds-body-md'
          : bodySize === 'sm'
            ? 'tds-body-sm'
            : 'tds-body-md'
      : uiSize
        ? uiSize === 'md'
          ? 'tds-ui-text-md'
          : uiSize === 'sm'
            ? 'tds-ui-text-sm'
            : uiSize === 'xs'
              ? 'tds-ui-text-xs'
              : 'tds-ui-text-md'
        : 'tds-body-md';

  // Heading styles map to semantic heading levels (display and lg are page
  // titles); headingLevel overrides the mapping. Non-headings render as div.
  const impliedLevel =
    headingSize === 'dp' || headingSize === 'lg'
      ? 1
      : headingSize === 'md'
        ? 2
        : headingSize === 'sm'
          ? 3
          : headingSize === 'xs'
            ? 4
            : headingSize
              ? 2
              : 0;

  const level = headingLevel
    ? Math.min(6, Math.max(1, Number(headingLevel) || impliedLevel || 2))
    : impliedLevel;

  const Tag = level ? `h${level}` : 'div';

  return html`<${Tag} class="${className} tds-color-content-default">
    ${content ? html`<span>${content}</span>` : ''}
  </${Tag}>`;
}

export default TypographyComponent;
