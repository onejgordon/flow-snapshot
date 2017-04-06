import React from 'react';
import {
  DrawerNavigator,
  ToolbarAndroid
} from 'react-navigation';
import Snapshot from '../../routes/Snapshot';
import Settings from '../../routes/Settings';
import Agent from '../../routes/Agent';
import Home from '../../routes/Home';

const LoggedIn = DrawerNavigator({
  Home: {screen: Home},
  Settings: {screen: Settings},
  Agent: {screen: Agent},
  Snapshot: {screen: Snapshot},
}, {
})

export default LoggedIn;
