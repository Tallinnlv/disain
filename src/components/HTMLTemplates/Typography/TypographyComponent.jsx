/**
 * @param {object} props
 * @param {string} [props.content] - The content before the link
 * @param {string} [props.bodySize] - Size of body text
 * @param {string} [props.uiSize] - Size of UI text
 * @param {string} [props.headingSize] - Size of heading text
 */

function TypographyComponent({ bodySize, uiSize, headingSize, content }) {
  const html = String.raw;

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

  // Render appropriate HTML tag based on headingSize
  const Tag =
    headingSize === 'lg'
      ? 'h1'
      : headingSize === 'md'
        ? 'h2'
        : headingSize === 'sm'
          ? 'h3'
          : headingSize === 'xs'
            ? 'h4'
            : 'div'; // Default to div if no headingSize is provided

  return html`<${Tag} class="${className} tds-color-content-default">
    ${content ? html`<span>${content}</span>` : ''}
  </${Tag}>`;
}

export default TypographyComponent;
