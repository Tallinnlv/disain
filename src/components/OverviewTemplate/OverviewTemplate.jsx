import React from 'react';
import styles from './styles.module.scss';

/**
 * Layout template for component documentation pages
 *
 * @component
 * @param {Object} props
 * @param {string} props.title - Component's title
 * @param {string} props.description - Component's description
 * @returns {JSX.Element} Component template
 */

export default function OverviewTemplate({ title, description }) {
  return (
    <div className={styles.SectionWrapper}>
      <h1 className={styles.SectionTitle}>{title}</h1>
      <p className={styles.SectionDescription}>{description}</p>
      <div className={styles.SectionHeader}></div>
      <br />
    </div>
  );
}
