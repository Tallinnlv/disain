import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import styles from './styles.module.css';
function AdmonitionContainer({type, className, children}) {
  return (
    <div
      className={clsx(
        ThemeClassNames.common.admonition,
        ThemeClassNames.common.admonitionType(type),
        styles.admonition,
        className,
      )}>
      {children}
    </div>
  );
}
function AdmonitionHeading({icon, title}) {
  return null;
}
function AdmonitionContent({icon, children}) {
  return children ? (
    <div className={styles.admonitionContent}>
      <span>{icon}</span>
      {children}
    </div>
  ) : null;
}

export default function AdmonitionLayout(props) {
  const {type, icon, title, children, className} = props;
  return (
    <AdmonitionContainer type={type} className={className}>
      {title || icon ? <AdmonitionHeading title={title} icon={icon} /> : null}
      <AdmonitionContent icon={icon}>{children}</AdmonitionContent>
    </AdmonitionContainer>
  );
}
