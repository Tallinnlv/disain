import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import styles from './Toggle.module.scss';
import SunSvg from '@site/static/img/icons/sun.svg';
import MoonSvg from '@site/static/img/icons/moon.svg';
import MobileSvg from '@site/static/img/icons/phone-mobile-svg.svg';
import DesktopSvg from '@site/static/img/icons/desktop-svg.svg';

const LABELS = {
  theme: 'Dark preview theme',
  view: 'Mobile preview width',
};

/**
 * @param {object} props
 * @param {'theme'|'view'} props.toggleType - The type of toggle: 'theme' (dark/light) or 'view' (mobile/desktop)
 * @param {boolean} [props.isActive] - External state to control toggle (default: `false`)
 * @param {Function} [props.onChange] - Callback to handle state change
 * @param {string} [props.label] - Accessible name; defaults per toggleType
 */
const Toggle = ({ toggleType = 'theme', isActive = false, onChange, label }) => {
  const [isToggled, setIsToggled] = useState(isActive);

  // Sync internal state with external isActive prop
  useEffect(() => {
    setIsToggled(isActive);
  }, [isActive]);

  const handleToggle = () => {
    const newState = !isToggled;
    setIsToggled(newState);
    if (onChange) {
      onChange(newState); // Notify parent of state change
    }
  };

  const icons = {
    theme: {
      active: <MoonSvg aria-hidden="true" focusable="false" />,
      inactive: <SunSvg aria-hidden="true" focusable="false" />,
    },
    view: {
      active: <MobileSvg aria-hidden="true" focusable="false" />,
      inactive: <DesktopSvg aria-hidden="true" focusable="false" />,
    },
  };

  // A real button gives us Enter/Space activation and focus for free;
  // aria-pressed exposes the on/off state that the circle position conveys visually.
  return (
    <button
      type="button"
      className={styles.toggleContainer}
      onClick={handleToggle}
      aria-pressed={isToggled}
      aria-label={label ?? LABELS[toggleType]}
    >
      <span
        className={clsx(styles.icon, styles.iconLeft, {
          [styles.hidden]: isToggled,
        })}
      >
        {icons[toggleType]?.inactive}
      </span>
      <span
        className={clsx(styles.toggleSwitch, {
          [styles.active]: isToggled,
        })}
      >
        <span className={styles.toggleCircle}></span>
      </span>
      <span
        className={clsx(styles.icon, styles.iconRight, {
          [styles.hidden]: !isToggled,
        })}
      >
        {icons[toggleType]?.active}
      </span>
    </button>
  );
};

export default Toggle;
