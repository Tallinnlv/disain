import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {
  findFirstSidebarItemLink,
  useDocById,
} from '@docusaurus/theme-common/internal';
import { usePluralForm } from '@docusaurus/theme-common';
import isInternalUrl from '@docusaurus/isInternalUrl';
import { translate } from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import styles from './styles.module.scss';
function useCategoryItemsPlural() {
  const { selectMessage } = usePluralForm();
  return (count) =>
    selectMessage(
      count,
      translate(
        {
          message: '{count} items',
          id: 'theme.docs.DocCard.categoryDescription.plurals',
          description:
            'The default description for a category card in the generated index about how many items this category includes',
        },
        { count },
      ),
    );
}
function CardContainer({ href, children }) {
  return (
    <Link
      href={href}
      className={clsx('tds-link tds-link--inline', styles.cardCustom)}
    >
      {children}
    </Link>
  );
}
function CardLayout({ href, icon, title }) {
  return (
    <CardContainer href={href}>
      <Heading
        as="h2"
        className={clsx('text--truncate', styles.cardTitle)}
        title={title}
      >
        {icon} {title}
      </Heading>
    </CardContainer>
  );
}
function CardCategory({ item }) {
  const href = findFirstSidebarItemLink(item);
  const categoryItemsPlural = useCategoryItemsPlural();
  // Unexpected: categories that don't have a link have been filtered upfront
  if (!href) {
    return null;
  }
  return <CardLayout href={href} icon="🗃️" title={item.label} />;
}
function CardLink({ item }) {
  const svgArrow = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16.5858 11.5L11.2929 6.20712L12.7071 4.79291L20.4142 12.5L12.7071 20.2071L11.2929 18.7929L16.5858 13.5H3V11.5H16.5858Z"
        fill="#0060AD"
      />
    </svg>
  );

  const icon = isInternalUrl(item.href) ? svgArrow : '🔗';
  const doc = useDocById(item.docId ?? undefined);
  return <CardLayout href={item.href} icon={icon} title={item.label} />;
}
export default function DocCard({ item }) {
  switch (item.type) {
    case 'link':
      return <CardLink item={item} />;
    case 'category':
      return <CardCategory item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}
