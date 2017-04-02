import React from 'react';
import {
  StackNavigator,
} from 'react-navigation';
import Report from '../../routes/Report';
import Settings from '../../routes/Settings';

const LoggedIn = StackNavigator({
  Report: {screen: Report},
  Settings: {screen: Settings}
})

export default LoggedIn;
