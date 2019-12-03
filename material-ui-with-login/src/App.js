import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Protected from './components/PrivateRoute/PrivateRoute';
import AdminPage from './components/AdminPage';

const App = () => {
  return (
    <>
      <Route exact path='/' component={Dashboard} />
      <Protected exact path='/admin' component={AdminPage} />
    </>
  );
};
export default App;
