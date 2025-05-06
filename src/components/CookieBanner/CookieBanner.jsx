import React, { useState, useEffect } from 'react';
import styles from './CookieBanner.module.scss';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Function to get a cookie value by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // Function to set a cookie
  const setCookie = (name, value, days) => {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ''}${expires}; path=/`;
  };

  // Check for the cookie on component mount
  useEffect(() => {
    const cookieConsent = getCookie('cookieConsent');
    if (!cookieConsent) {
      setIsVisible(true); // Show banner if no consent is given
    }
  }, []);

  const acceptCookies = () => {
    setIsVisible(false);
    setCookie('cookieConsent', 'true', 365); // Store cookie for 1 year
  };

  const declineCookies = () => {
    setIsVisible(false);
    setCookie('cookieConsent', 'false', 1); // Store "declined" cookie for 1 day
  };

  if (!isVisible) {
    return null; // Do not render the banner if consent is already given or declined
  }

  return (
    <div className={styles.cookieBanner}>
      <div className={styles.cookieContent}>
        <p>
          We use cookies on this site to enhance your user experience. You can
          read more about the use of cookies and the processing of personal data
          from the{' '}
          <a
            className="tds-link tds-link--inline"
            target="_blank"
            href="https://www.tallinn.ee/en/data-protection"
          >
            Data Protection Terms
          </a>
          .
        </p>
        <div
          className={styles.buttonGroup}
          style={{ display: 'flex', gap: '6px' }}
        >
          <button
            className="tds-button tds-button--primary tds-button--compact"
            onClick={acceptCookies}
          >
            Accept
          </button>
          <button
            className="tds-button tds-button--secondary-neutral tds-button--compact "
            onClick={declineCookies}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
