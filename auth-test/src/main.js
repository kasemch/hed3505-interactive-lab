import React from 'react';
import { createRoot } from 'react-dom/client';
import { NeonAuthUIProvider, AuthView } from '@neondatabase/neon-js/auth/react/ui';
import { authClient } from './auth.js';

const rootElement = document.getElementById('hed3505-r2-auth-root');
if (!rootElement) throw new Error('Missing HED3505 R2 auth mount point');

function App() {
  return React.createElement(
    NeonAuthUIProvider,
    { authClient },
    React.createElement(AuthView, { pathname: 'sign-in' })
  );
}

createRoot(rootElement).render(React.createElement(App));
