import React, { useState, useEffect, useRef } from 'react';
import styles from './CookieBanner.module.scss';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const bannerRef = useRef(null);

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

  // The banner is fixed-positioned and last in DOM order, so keyboard and
  // screen-reader users would otherwise only reach it after the whole page.
  useEffect(() => {
    if (isVisible) {
      bannerRef.current?.focus();
    }
  }, [isVisible]);

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
    <section
      className={styles.cookieBanner}
      role="region"
      aria-label="Cookie consent"
      tabIndex={-1}
      ref={bannerRef}
    >
      <div className={styles.cookieContent}>
        <p>
          We use cookies on this site to enhance your user experience. You can
          read more about the use of cookies and the processing of personal data
          from the{' '}
          <a
            className="tds-link tds-link--inline"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.tallinn.ee/en/data-protection"
          >
            Data Protection Terms
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
          .
        </p>
        <div
          className={styles.buttonGroup}
          style={{ display: 'flex', gap: '6px' }}
        >
          <button
            type="button"
            className="tds-button tds-button--primary tds-button--compact"
            onClick={acceptCookies}
          >
            Accept
          </button>
          <button
            type="button"
            className="tds-button tds-button--secondary-neutral tds-button--compact "
            onClick={declineCookies}
          >
            Decline
          </button>
        </div>
      </div>
    </section>
  );
};

export default CookieBanner;
