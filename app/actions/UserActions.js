'use strict';

import alt from '../config/alt';
import {GoogleSignin} from 'react-native-google-signin';
import {AsyncStorage, ToastAndroid} from 'react-native';
import constants from '../config/constants';

class UserActions {

  constructor() {
      // Automatic action
      // this.generateActions('saveSession');
  }

  // Helpers

  suggestionStoreKey(user) {
    if (user) {
      let key = `@FlowStore:recommendation:${user.id}`;
      return key;
    }
  }

  // Actions

  loadSession() {
    return (dispatch) => {
      AsyncStorage.getItem(constants.SESSION_KEY).then((value) => {
        if (value != null) {
          dispatch(value);
        } else console.log("No session");
      }, (err) => {
        ToastAndroid.show("Error loading session", ToastAndroid.SHORT);
      });
    }
  }

  updateUserSetting(user, params) {
    return (dispatch) => {
      let val = {settings: params};
      let key = constants.SESSION_KEY;
      AsyncStorage.mergeItem(key, JSON.stringify(val)).then(() => {
        dispatch(params);
      });
    }
  }

  setSuggestion(user, key, value) {
    return (dispatch) => {
      let val = {};
      let merge_rec = {};
      merge_rec[value] = 1;
      val[key] = merge_rec;
      console.log(val);
      AsyncStorage.mergeItem(this.suggestionStoreKey(user), JSON.stringify(val)).then(() => {
        dispatch({key: key, value: value});
      });
    }
  }

  clearSuggestions(user) {
    return (dispatch) => {
      AsyncStorage.removeItem(this.suggestionStoreKey(user)).then(() => {
        dispatch();
      });
    }
  }

  getSuggestions(user) {
    return (dispatch) => {
      AsyncStorage.getItem(this.suggestionStoreKey(user)).then((value) => {
        if (value) {
          dispatch(JSON.parse(value))
        } else console.log('no suggestions yet');
      }, (err) => {
        console.error(err);
      });
    }
  }

  userSignout() {
    return (dispatch) => {
      AsyncStorage.removeItem(constants.SESSION_KEY).then(() => {
        dispatch();
      });
    }
  }

  updateUser(_user) {
    console.log('updateUser');
    console.log(_user);
    if (_user != null) {
      console.log('returning user...')
      AsyncStorage.mergeItem(constants.SESSION_KEY, JSON.stringify({user: _user}));
      return _user;
    }
    return (dispatch) => {
      GoogleSignin.currentUserAsync().then((user) => {
        console.log(['USER', user]);
        AsyncStorage.mergeItem(constants.SESSION_KEY, JSON.stringify({user: user})).then(() => {
          console.log('Saved user in session')
          dispatch(user);
        });
      });
    }
  }
}

export default alt.createActions(UserActions);
