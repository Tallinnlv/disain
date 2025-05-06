import React from 'react';
import Layout from '@theme-original/Layout';
import CookieBanner from '../../components/CookieBanner/CookieBanner';

export default function LayoutWrapper(props) {
  return (
    <>
      <Layout {...props} />
      <CookieBanner />
    </>
  );
}
