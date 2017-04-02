import React from 'react';
import {
  StackNavigator,
} from 'react-navigation';
import SignIn from '../../routes/SignIn';
import About from '../../routes/About';

const LoggedOut = StackNavigator({
  About: {screen: About},
  SignIn: {screen: SignIn},
})

export default LoggedOut;
