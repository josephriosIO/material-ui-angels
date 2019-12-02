import React from 'react';
import ReactDOM from 'react-dom';
import { AuthProvider } from '@reshuffle/react-auth';

import App from './App';
import './index.css';


ReactDOM.render((
  <AuthProvider>
    <App />
  </AuthProvider>
), document.getElementById('root'));
