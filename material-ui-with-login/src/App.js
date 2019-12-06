import React from 'react';
import { Route } from 'react-router-dom';
import Routes from './components/Angels/Routes';
import LandingPage from './components/LandingPage/LandingPage';
import StartupsDashboard from './components/Startups/Dashboard';

const App = props => {
  return (
    <>
      <Route exact path='/' component={LandingPage} />
      <Route path='/startups' component={StartupsDashboard} />
      <Route path='/angels' component={Routes} />
    </>
  );
};
export default App;
