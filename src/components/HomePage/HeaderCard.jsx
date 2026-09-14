import styles from './HeaderCard.module.scss';
import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

const CardList = [
  {
    title: 'Foundations',
    description:
      'Make Tallinn’s services look consistent with guides for applying layout, typography, colour and images.',
    link: '/docs/foundations',
    svg: '/img/mainPage/image-foundations.svg',
  },
  {
    title: 'Components',
    description:
      'Save time with reusable, accessible components for forms, navigation, panels, tables and more.',
    link: '/docs/components',
    svg: '/img/mainPage/image-components.svg',
  },
  {
    title: 'Patterns',
    description:
      'Help users complete common tasks like entering names and addresses, filling in forms and creating accounts.',
    link: '/docs/patterns',
    svg: '/img/mainPage/image-patterns.svg',
  },
  {
    title: "Tallinn's Visual Identity",
    description:
      'Our unified visual identity makes city communication easier and conveys the message of Tallinn as an attractive and modern living environment.',
    link: 'https://identiteet.tallinn.ee/#/',
    svg: '/img/mainPage/image-identity.svg',
    external: true,
  },
];
function HeaderCardItem({ title, description, link, svg, external = false }) {
  const arrowRight = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.5858 11.5L11.2929 6.20706L12.7071 4.79285L20.4142 12.5L12.7071 20.2071L11.2929 18.7928L16.5858 13.5H3V11.5H16.5858Z"
        fill="#0060AD"
      />
    </svg>
  );

  const linkIcon = external ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21 3H13V5H17.5858L8.29291 14.2929L9.70712 15.7071L19 6.41421V11H21V3ZM5 5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21H17C18.1046 21 19 20.1046 19 19V14H17V19H5V7L10 7V5H5Z"
        fill="#0060AD"
      />
    </svg>
  ) : null;

  // The heading holds the only link; a ::after pseudo-element on that link
  // (see .HeaderCard in the stylesheet) stretches the click target over the
  // whole card, so the card stays clickable without nesting a heading in a link.
  return (
    <div className={clsx(styles.layout, { [styles.fullWidth]: external })}>
      <div className={styles.HeaderCard}>
        <img src={svg} alt="" className={styles.svgImage} />
        <div className={styles.textContainer}>
          <h2>
            {external ? (
              <a
                className="tds-link tds-link--inline"
                href={link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {title}
                {linkIcon}
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            ) : (
              <Link className="tds-link tds-link--inline" to={link}>
                {arrowRight}
                {title}
              </Link>
            )}
          </h2>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HeaderCard() {
  return (
    <div className={styles.container}>
      {CardList.map((props, idx) => (
        <HeaderCardItem key={idx} {...props} />
      ))}
    </div>
  );
}
