import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { useDocsVersion } from '@docusaurus/theme-common/internal';
import { useCurrentVersion } from '@site/src/hooks/useCurrentVersion';
import { useLatestVersion } from '@site/src/hooks/useLatestVersion';
export default function DocVersionBadge({ className }) {
  const currentVersion = useCurrentVersion();
  const latestVersion = useLatestVersion();
  const CANARY_IDENTIFIER = 'Canary 🚧';

  const isCanaryVersion = currentVersion === CANARY_IDENTIFIER;
  const isLatestVersion = currentVersion === latestVersion;
  const changelogPath = `/docs/${
    isCanaryVersion ? 'next/' : !isLatestVersion ? `${currentVersion}/` : ''
  }components/changelog/`;
  const versionMetadata = useDocsVersion();
  if (versionMetadata.badge) {
    return (
      <span
        className={clsx(
          className,
          ThemeClassNames.docs.docVersionBadge,
          'badge badge--secondary',
        )}
      >
        <Translate
          id="theme.docs.versionBadge.label"
          values={{
            versionLabel: versionMetadata.label,
            versionLast: versionMetadata.isLast ? '(latest)' : '',
          }}
        >
          {'Version: {versionLabel} {versionLast}'}
        </Translate>
        <br></br>
        <br></br>
        <Link to={changelogPath} className={'tds-link tds-link--inline'}>
          Change log
        </Link>
      </span>
    );
  }
  return null;
}
