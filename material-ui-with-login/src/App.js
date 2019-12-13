import '@reshuffle/code-transform/macro';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Routes from './components/Angels/Routes';
import LandingPage from './components/LandingPage/LandingPage';
import StartupRoutes from './components/Startups/Routes';
import AngelInvite from './components/Angels/AngelInvite';

const App = () => {
  return (
    <>
      <Switch>
        <Route exact path='/' component={LandingPage} />
        <Route path='/startups' component={StartupRoutes} />
        <Route path='/angels' component={Routes} />
        <Route exact path={`/invite/:id`} component={AngelInvite} />
      </Switch>
    </>
  );
};
export default App;
