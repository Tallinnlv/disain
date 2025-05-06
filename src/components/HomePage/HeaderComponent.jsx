import React from 'react';
import styles from './HeaderComponent.module.scss';
import { Link } from 'react-router-dom';

export default function HeaderComponent() {
  return (
    <div>
      <img
        style={{ backgroundColor: 'white' }}
        src="/img/main-pattern.svg"
        className={styles.HeaderComponentBackground}
        alt="Header background"
      />
      <div className={styles.HeaderComponent}>
        <div className={styles.layout}>
          <h1>Tallinn Design System</h1>
          <h2>
            The central digital experience resource of Tallinn. Guidelines,
            design assets and component libraries for building a consistent and
            accessible digital brand across the city.
          </h2>

          <Link
            className="tds-button tds-button--primary"
            to="/docs/getting-started"
          >
            Getting started{' '}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16.5858 11L11.2929 5.70712L12.7071 4.29291L20.4142 12L12.7071 19.7071L11.2929 18.2929L16.5858 13H3V11H16.5858Z"
                fill="white"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
