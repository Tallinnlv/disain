import HeaderComponent from '../components/HomePage/HeaderComponent';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HeaderCard from '../components/HomePage/HeaderCard';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="The central digital experience resource of Tallinn. Guidelines, design assets and component libraries for building a consistent and accessible digital brand across the city."
    >
      <main>
        <HeaderComponent />
        <HeaderCard />
      </main>
    </Layout>
  );
}
