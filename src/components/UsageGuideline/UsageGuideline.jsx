import * as React from 'react';
import styles from './UsageGuideline.module.scss';
import clsx from 'clsx';

const IconAllowed = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.8138 6.08118L10.1277 21.0418L2.29297 13.207L3.70718 11.7928L9.87247 17.9581L19.1863 4.9187L20.8138 6.08118Z"
      fill="#017E31"
    />
  </svg>
);

const IconNotAllowed = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.99991 4.08582L11.9999 11.0858L18.9999 4.08582L20.4141 5.50003L13.4141 12.5L20.4141 19.5L18.9999 20.9142L11.9999 13.9142L4.99991 20.9142L3.58569 19.5L10.5857 12.5L3.58569 5.50003L4.99991 4.08582Z"
      fill="#D51A27"
    />
  </svg>
);

/**
 * UsageGuideline is a wrapper component that displays the usage guideline of a component.
 * @param {object} props
 * @param {React.ReactNode} [props.children] - The children of the component.
 * @param {boolean} [props.permitted=true] - Indicator of whether the usage is allowed or not.
 * @returns {React.ReactElement}
 */
const UsageGuideline = ({ children, permitted = true }) => {
  return (
    <div className={styles.container}>
      {children}
      <div
        className={clsx(
          styles.captionContainer,
          permitted ? styles.permitted : styles.prohibited,
        )}
      >
        {permitted ? IconAllowed : IconNotAllowed}
        <p>{permitted ? 'Do' : "Don't"}</p>
      </div>
    </div>
  );
};

export default UsageGuideline;
