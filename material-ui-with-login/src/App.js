import '@reshuffle/code-transform/macro';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Routes from './components/Angels/Routes';
import LandingPage from './components/LandingPage/LandingPage';
import StartupRoutes from './components/Startups/Routes';
import Protected from './components/PrivateRoute/PrivateRoute';
const App = () => {
  return (
    <>
      <Switch>
        <Route exact path='/' component={LandingPage} />
        <Route path='/startups' component={StartupRoutes} />
        <Route path='/angels' component={Routes} />
      </Switch>
    </>
  );
};
export default App;
