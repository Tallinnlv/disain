import React from 'react';
import Navbar from '@theme-original/Navbar';
import NotificationAlert from '../../components/NotificationAlert/NotificationAlert';

export default function NavbarWrapper(props) {
  return (
    <>
      <NotificationAlert />
      <Navbar {...props} />
    </>
  );
}
