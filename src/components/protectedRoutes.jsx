import React, { useState, useEffect, useCallback } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import api from 'api';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants';

function ProtectedRoute({ children, ...rest }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  const refreshToken = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) {
      setIsAuthorized(false);
      return;
    }
    try {
      const res = await api.post('/api/token/refresh/', { refresh: refreshToken });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      setIsAuthorized(false);
    }
  }, []);

  const auth = useCallback(async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const tokenExpiration = decoded.exp;
      const now = Date.now() / 1000;

      if (tokenExpiration < now) {
        await refreshToken();
      } else {
        setIsAuthorized(true);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      setIsAuthorized(false);
    }
  }, [refreshToken]);

  useEffect(() => {
    let isMounted = true;
    auth().catch((error) => {
      if (isMounted) {
        console.error(error);
        setIsAuthorized(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [auth]);

  if (isAuthorized === null) {
    return <div>Loading...</div>; // or return null for no UI during loading
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthorized ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/auth",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export default ProtectedRoute;
