
'use client'
import React from 'react';
import SignIn from '../components/signin/page';

import "../globals.css";
import useAuth from '../lip/hooks/useAuth';



const DashboardLayoutComponent = ({ children }) => {
  const isAuthenticated = useAuth();

  return isAuthenticated ? (
    <div>
      {children}
    </div>
  ) : (<SignIn />);
}

export default DashboardLayoutComponent;
