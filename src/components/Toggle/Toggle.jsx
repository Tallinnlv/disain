import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import styles from './Toggle.module.scss';
import SunSvg from '@site/static/img/icons/sun.svg';
import MoonSvg from '@site/static/img/icons/moon.svg';
import MobileSvg from '@site/static/img/icons/phone-mobile-svg.svg';
import DesktopSvg from '@site/static/img/icons/desktop-svg.svg';

/**
 * @param {object} props
 * @param {'theme'|'view'} props.toggleType - The type of toggle: 'theme' (dark/light) or 'view' (mobile/desktop)
 * @param {boolean} [props.isActive] - External state to control toggle (default: `false`)
 * @param {Function} [props.onChange] - Callback to handle state change
 */
const Toggle = ({ toggleType = 'theme', isActive = false, onChange }) => {
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
      active: <MoonSvg />,
      inactive: <SunSvg />,
    },
    view: {
      active: <MobileSvg />,
      inactive: <DesktopSvg />,
    },
  };

  return (
    <div
      className={styles.toggleContainer}
      onClick={handleToggle}
      role="button"
      tabIndex={0}
    >
      <span
        className={clsx(styles.icon, styles.iconLeft, {
          [styles.hidden]: isToggled,
        })}
      >
        {icons[toggleType]?.inactive}
      </span>
      <div
        className={clsx(styles.toggleSwitch, {
          [styles.active]: isToggled,
        })}
      >
        <div className={styles.toggleCircle}></div>
      </div>
      <span
        className={clsx(styles.icon, styles.iconRight, {
          [styles.hidden]: !isToggled,
        })}
      >
        {icons[toggleType]?.active}
      </span>
    </div>
  );
};

export default Toggle;
