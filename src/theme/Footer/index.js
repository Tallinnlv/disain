import React from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './styles.module.scss';
import Outbound from '@site/static/img/icons/outbound.svg';
import { useCurrentVersion } from '@site/src/hooks/useCurrentVersion';
import { useLatestVersion } from '@site/src/hooks/useLatestVersion';

export default function Footer() {
  const currentVersion = useCurrentVersion();
  const latestVersion = useLatestVersion();

  const resolveLink = (href) => {
    // If no version is available, return the path without a version prefix
    if (!currentVersion) {
      return `/docs${href}`;
    }
    // If current version is the latest, do not include version in the path
    if (currentVersion === latestVersion) {
      return `/docs${href}`;
    }
    // Handle special case for "Canary 🚧"
    const version = currentVersion === 'Canary 🚧' ? 'next' : currentVersion;
    return `/docs/${version}${href}`;
  };

  const footerLinks = [
    { label: 'Getting started', href: '/getting-started' },
    { label: 'Foundations', href: '/foundations/' },
    { label: 'Components', href: '/components/' },
    { label: 'Patterns', href: '/patterns/' },
  ];

  return (
    <footer className={clsx('footer', styles.footer)}>
      <div className={styles.footerWrapper}>
        <div className={styles.footerTop}>
          <div className={styles.footerTitleContainer}>
            <h4 className={styles.footerTitle}>Tallinn Design System</h4>
          </div>
          <p className={styles.footerDescription}>
            If you feel something’s missing or there's room for improvement, please let us know at{' '}
            <a
              className="tds-link tds-link--inline-neutral"
              href="mailto:disain@tallinnlv.ee"
            >
              disain@tallinnlv.ee
            </a>
          </p>
        </div>
        <div className={styles.footerLinksContainer}>
          <div className={styles.footerLinks}>
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                className="tds-link tds-link--inline-neutral"
                to={resolveLink(link.href)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className={styles.footerRightLink}>
            <Link
              className="tds-link tds-link--inline-neutral"
              to="https://identiteet.tallinn.ee/#/"
              target="_blank"
            >
              Tallinn's Visual Identity <Outbound />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
