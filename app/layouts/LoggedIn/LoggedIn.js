import React from 'react';
import {
  DrawerNavigator,
  ToolbarAndroid
} from 'react-navigation';
import Snapshot from '../../routes/Snapshot';
import Settings from '../../routes/Settings';
import Home from '../../routes/Home';

const LoggedIn = DrawerNavigator({
  Home: {screen: Home},
  Settings: {screen: Settings},
  Snapshot: {screen: Snapshot},
}, {
})

export default LoggedIn;
