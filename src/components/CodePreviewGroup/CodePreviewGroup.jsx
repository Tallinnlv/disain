import React from 'react';
import styles from './CodePreviewGroup.module.scss';

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.minHeight] - The minimum height of the component
 * @param {boolean} [props.twoColumns] - The minimum height of the component
 * @param {boolean} [props.twoRows] - The minimum height of the component
 * @returns {JSX.Element} - Inline wrapper for multiple `CodePreview` components
 */
const CodePreviewGroup = ({ children, minHeight, twoColumns, twoRows }) => {
  return (
    <div
      className={`${styles.root} ${twoColumns ? styles.twoColumns : ''} ${twoRows ? styles.twoRows : ''}`}
      style={{ minHeight }}
    >
      {children}
    </div>
  );
};

export default CodePreviewGroup;
