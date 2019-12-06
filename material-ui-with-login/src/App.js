import React from 'react';
import { Route } from 'react-router-dom';
import Routes from './components/Angels/Routes';
import LandingPage from './components/LandingPage/LandingPage';
import StartupRoutes from './components/Startups/Routes';

const App = props => {
  return (
    <>
      <Route exact path='/' component={LandingPage} />
      <Route path='/startups' component={StartupRoutes} />
      <Route path='/angels' component={Routes} />
    </>
  );
};
export default App;
