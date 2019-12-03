import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';

const App = () => {
  return <Route exact path='/' component={Dashboard} />;
};
export default App;
