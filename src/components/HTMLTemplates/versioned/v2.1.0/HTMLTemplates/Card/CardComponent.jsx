import { html } from '@site/src/utils/formatHtml';

/**
 *
 * @param {object} props
 * @param {string} [props.title] - The title of the Card
 * @param {string} [props.description = ''] - The description of the card
 * @param {string} [props.type] - The type of the card
 * @param {string} [props.variant] - The variant of the Content Card
 * @param {string} [props.href = '#'] - The link target of the card / card action
 * @param {number} [props.headingLevel = 3] - Heading level of the content card title (1-6)
 */

const CardComponent = ({
  title,
  description = '',
  type,
  variant,
  href = '#',
  headingLevel = 3,
}) => {
  const level = Math.min(6, Math.max(1, Number(headingLevel) || 3));
  const heading = `h${level}`;

  if (type === 'link') {
    return html`
<div class="tds-card tds-card--link">
  <div class="tds-card--link__icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M16.5858 11L11.2929 5.70706L12.7071 4.29285L20.4142 12L12.7071 19.7071L11.2929 18.2928L16.5858 13H3V11H16.5858Z" fill="currentColor"/>
    </svg>
  </div>
  <div class="tds-card--link__wrapper">
    <a href="${href}" target="_self" class="tds-card--link__title">${title}</a>
    ${description ? `<div class="tds-card--link__description">${description}</div>` : ''}
  </div>
</div>
    `;
  }

  if (variant === 'transparent') {
    return html`
<article>
  <a class="tds-card tds-card--content tds-card--content--transparent" href="${href}" target="_self">
    <div class="tds-card--content--transparent__image_wrapper"><img class="tds-card--content--transparent__image" src="/img/cardOverview/transparent.jpeg" alt="Tallinn Old Town"></div>
    <div class="tds-card--content__wrapper">
      <${heading} class="tds-card--content__title">${title}</${heading}>
      ${description ? `<div class="tds-card--content__description">${description}</div>` : ''}
    </div>
  </a>
</article>
  `;
  }

  return html`
<div class="tds-card tds-card--content tds-card--content--outlined">
  <span class="tds-badge tds-badge--primary tds-badge--medium">
    <span class="tds-badge__text tds-badge__text--medium">New</span>
  </span>
  <div class="tds-card--content__wrapper">
    <${heading} class="tds-card--content__title">${title}</${heading}>
    ${description ? `<div class="tds-card--content__description">${description}</div>` : ''}
    <a href="${href}" class="tds-link tds-link--standalone">Action</a>
  </div>
</div>
  `;
};

export default CardComponent;
