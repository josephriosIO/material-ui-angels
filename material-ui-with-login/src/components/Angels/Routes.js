import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import AdminPage from './AdminPanel/AdminPage';
import Profile from './Profile/Profile';
import NavBar from './Nav/NavBar';
import SeeStartups from './MeetingPanel/SeeStartups';
import Protected from '../PrivateRoute/PrivateRoute';
import MeetingCreator from './MeetingPanel/MeetingCreator';
import AllStartupsView from './StartupsView/AllStartupsView';
import VotingSystem from './MeetingPanel/VotingSystem/VotingSystem';
import AdminMeetingPanel from './MeetingPanel/AdminMeetingPanel';

const Routes = props => {
  return (
    <>
      <NavBar />
      <Route exact path={props.match.path} component={Dashboard} />

      <Protected
        exact
        path={`${props.match.path}/admin`}
        component={AdminPage}
      />
      <Protected
        exact
        path={`${props.match.path}/profile/:id`}
        component={Profile}
      />
      <Protected
        exact
        path={`${props.match.path}/meetings`}
        component={SeeStartups}
      />
      <Protected
        exact
        path={`${props.match.path}/meeting/:id`}
        component={AdminMeetingPanel}
      />
      <Protected
        exact
        path={`${props.match.path}/createmeeting`}
        component={MeetingCreator}
      />
      <Protected
        exact
        path={`${props.match.path}/startups`}
        component={AllStartupsView}
      />
      <Protected
        exact
        path={`${props.match.path}/vote`}
        component={VotingSystem}
      />
    </>
  );
};

export default Routes;
