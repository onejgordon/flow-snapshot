import React from 'react';
import {
  StackNavigator,
} from 'react-navigation';
import SignIn from '../../routes/SignIn';

const LoggedOut = StackNavigator({
  SignIn: {screen: SignIn},
})

export default LoggedOut;
