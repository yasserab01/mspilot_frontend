import React from 'react';
import { createRoot } from 'react-dom/client';
import 'assets/css/App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
import ProtectedRoute from 'components/protectedRoutes';
import { UserProvider } from './contexts/UserContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Create a root and render your App component
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <ThemeEditorProvider>
        <UserProvider>
          <BrowserRouter>
            <Switch>
              <Route path="/auth" component={AuthLayout} />
              <ProtectedRoute path="/admin">
                <AdminLayout />
              </ProtectedRoute>
              <Redirect from="/" to="/admin" />
            </Switch>
            <ToastContainer />
          </BrowserRouter>
        </UserProvider>
      </ThemeEditorProvider>
    </React.StrictMode>
  </ChakraProvider>
);
