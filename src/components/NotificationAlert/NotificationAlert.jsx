import React, { useState, useEffect } from 'react';
import AlertIcon from '@site/static/img/icons/notification-info.svg';
import styles from './NotificationAlert.module.scss';

// Helper functions to get and set cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const setCookie = (name, value, days) => {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/`;
};

const NotificationAlert = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Check cookie on component mount
  useEffect(() => {
    const cookieConsent = getCookie('cookieConsent');
    const alertDismissed = getCookie('alertDismissed');

    // If user has accepted cookies and alert is dismissed, hide the alert
    if (cookieConsent === 'true' && alertDismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const dismissAlert = () => {
    setIsVisible(false);

    const cookieConsent = getCookie('cookieConsent');
    // Only set the dismissal cookie if cookies have been accepted
    if (cookieConsent === 'true') {
      setCookie('alertDismissed', 'true', 30); // Remember dismissal for 30 days
    }
  };

  if (!isVisible) {
    return null; // Do not render anything if the alert is dismissed
  }

  return (
    <div className={styles.alertContainer}>
      <div className={styles.alertContent}>
        <span className={styles.alertIcon}>
          <AlertIcon />
        </span>
        <p className={styles.alertText}>
          <strong>We're excited to launch Tallinn Design System!</strong> While
          it allows you to create interfaces the Tallinn way it's still a work
          in progress. If you think something’s missing or isn't working, please
          let us know at{' '}
          <a
            className="tds-link tds-link--inline-neutral"
            href="mailto:disain@tallinnlv.ee"
          >
            disain@tallinnlv.ee
          </a>
        </p>
      </div>
      <button
        className="tds-button tds-button--tertiary-neutral tds-button--compact"
        onClick={dismissAlert}
      >
        Dismiss
      </button>
    </div>
  );
};

export default NotificationAlert;
