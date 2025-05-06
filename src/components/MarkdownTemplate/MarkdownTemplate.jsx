import * as React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

/**
 * Layout template for component documentation pages
 *
 * @component
 * @param {Object} props
 * @param {string} props.title - Component's title
 * @param {string | JSX.Element =} props.overview - Component's code examples
 * @param {string | JSX.Element =} props.usage - Main description of the component
 * @param {string | JSX.Element =} props.a11y - Component's accessibility guidelines
 * @returns {JSX.Element} Component template
 */
export default function ComponentTemplate({ title, overview, usage, a11y }) {
  return (
    <>
      <h1>{title.charAt(0).toUpperCase() + title.slice(1)}</h1>
      <div
        style={{
          height: '500px',
          width: '100%',
          backgroundColor: 'var(--color-surface-feedback-info-faint)',
          position: 'absolute',
          left: 0,
          transform: 'translateY(calc(59px - 100%))',
          zIndex: -1,
        }}
      ></div>
      <Tabs
        defaultValue="overview"
        queryString="tab"
        values={[
          { label: 'Overview', value: 'overview' },
          usage && { label: 'Usage', value: 'usage' },
          a11y && { label: 'Accessibility', value: 'accessibility' },
        ].filter(Boolean)}
      >
        <TabItem value="overview">{overview}</TabItem>
        {usage && <TabItem value="usage">{usage}</TabItem>}
        {a11y && <TabItem value="accessibility">{a11y}</TabItem>}
      </Tabs>
    </>
  );
}
