'use strict';

import alt from '../config/alt';
import {GoogleSignin} from 'react-native-google-signin';

export class UserActions {

  constructor() {
      // Automatic action
      this.generateActions('updateUserSetting', 'checkForSession', 'saveSession', 'userSignout');
  }

  updateUser(_user) {
    if (_user != null) return _user;
    return (dispatch) => {
      GoogleSignin.currentUserAsync().then((user) => {
        console.log(['USER', user]);
        dispatch(user);
      }).done();
    }
    //   console.log('USER', user);
    //   this.dispatch(user);
    // }).done();
  }

  // fetchMessages(location) {
  //   this.dispatch();
  //   MessagesFetcher.fetch(location)
  //     .then((messages)=>{
  //       this.actions.updateMessages(messages); })
  //     .catch((e)=>{
  //       console.log('Response Error', e);
  //       this.actions.messagesFailed(e);
  //     });
  // }

  // messagesFailed(errorMessage) {
  //   this.dispatch(errorMessage);
  // }
}

export default alt.createActions(UserActions);