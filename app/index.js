import React, { Component } from 'react';

import LoggedOut from './layouts/LoggedOut';
import LoggedIn from './layouts/LoggedIn';
import Loading from './components/Loading';
import settings from './config/settings';

const FlowMobileApp = (props) => {
  const { status, user, loggingIn } = props;

  if (status.connected === false || loggingIn) {
    return <Loading />;
  } else if (user !== null) {
    return <LoggedIn />;
  }
  return <LoggedOut />;
};

FlowMobileApp.propTypes = {
  status: React.PropTypes.object,
  user: React.PropTypes.object,
  loggingIn: React.PropTypes.bool,
};

export default createContainer(() => {
  return {
    // status: Meteor.status(),
    // user: Meteor.user(),
    // loggingIn: Meteor.loggingIn(),
  };
}, FlowMobileApp);