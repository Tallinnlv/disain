const html = (strings, ...values) => {
  const raw = String.raw(strings, ...values);

  return raw
    .split('\n')
    .filter(line => line.trim())
    .join('\n');
};

/**
 *
 * @param {object} props
 * @param {string} [props.title] - The title of the Card
 * @param {string} [props.description = ''] - The description of the card
 * @param {string} [props.type] - The type of the card
 * @param {string} [props.variant] - The variant of the Content Card
 */

const CardComponent = ({
  title,
  description = '',
  type,
  variant,
}) => {

  if (type === 'link') {
    return html`
<div class="tds-card tds-card--link">
  <div class="tds-card--link__icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M16.5858 11L11.2929 5.70706L12.7071 4.29285L20.4142 12L12.7071 19.7071L11.2929 18.2928L16.5858 13H3V11H16.5858Z" fill="currentColor"/>
    </svg>
  </div>
  <div class="tds-card--link__wrapper">
    <a href="#" target="_self" class="tds-card--link__title">${title}</a>
    ${description ? `<div class="tds-card--link__description">${description}</div>` : ''}
  </div>
</div>
    `;
  }

  if (variant === 'transparent') {
    return html`
<article>
  <a class="tds-card tds-card--content tds-card--content--transparent" href="#" target="_self">
    <div class="tds-card--content--transparent__image_wrapper"><img class="tds-card--content--transparent__image" src="/img/cardOverview/transparent.jpeg" alt="Tallinn Old Town"></div>
    <div class="tds-card--content__wrapper">
      <div class="tds-card--content__title">${title}</div>
      ${description ? `<div class="tds-card--content__description">${description}</div>` : ''}
    </div>
  </a>
</article>
  `;
  }

  return html`
<div class="tds-card tds-card--content tds-card--content--outlined">
  <span class="tds-badge tds-badge--primary tds-badge--medium" role="status" aria-label="Medium badge">
    <span class="tds-badge__text tds-badge__text--medium">New</span>
  </span>
  <div class="tds-card--content__wrapper">
    <div class="tds-card--content__title">${title}</div>
    ${description ? `<div class="tds-card--content__description">${description}</div>` : ''}
    <a href="javascript: void();" class="tds-link tds-link--standalone">Action</a>
  </div>
</div>
  `;
};

export default CardComponent;
