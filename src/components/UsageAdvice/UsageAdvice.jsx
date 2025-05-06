import * as React from 'react';
import styles from './UsageAdvice.module.scss';
import clsx from 'clsx';

/**
 * UsageAdvice is a wrapper component that displays when to use or not to use components.
 * @param {object} props
 * @param {React.ReactNode} [props.children] - The children of the component.
 * @param {boolean} [props.permitted=true] - Indicator of whether the usage is allowed or not.
 * @returns {React.ReactElement}
 */
const UsageAdvice = ({ children, permitted = true }) => {
  return (
    <div className={styles.container}>
      <div
        className={clsx(
          styles.captionContainer,
          permitted ? styles.permitted : styles.prohibited,
        )}
      >
        <h2>{permitted ? 'When to use' : 'When not to use'}</h2>
        {children}
      </div>
    </div>
  );
};

export default UsageAdvice;
