import React from 'react';
import {
  TabNavigator,
} from 'react-navigation';
import Snapshot from '../../routes/Snapshot';
import Settings from '../../routes/Settings';

const LoggedIn = TabNavigator({
  Settings: {screen: Settings},
  Snapshot: {screen: Snapshot},
}, {
  tabBarOptions: {
    activeTintColor: '#ECC748',
  },
})

export default LoggedIn;
