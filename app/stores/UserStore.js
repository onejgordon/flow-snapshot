import alt from '../config/alt';
import UserActions from '../actions/UserActions';
import {AsyncStorage, ToastAndroid} from 'react-native';

export class UserStore {

  constructor() {
    this.bindActions(UserActions);
    this.user = null;
    this.settings = {};
    this.errorMessage = null;

    // this.bindListeners({
    //   handleUpdateUser: UserActions.UPDATE_USER
    // });
    this.exportPublicMethods({
      getSetting: this.getSetting
    });
    this.SESSION_KEY = '@FlowStore:session';
  }

  onUpdateUser(user) {
    this.user = user;
    this.errorMessage = null;
    this.savePersistent();
  }

  onUpdateUserSetting(payload) {
    Object.keys(payload).forEach((k) => {
      console.log(k + ' -> ' + payload[k]);
      this.settings[k] = payload[k];
    })
    this.savePersistent();
    ToastAndroid.show("Settings saved", ToastAndroid.SHORT);
  }

  onCheckForSession() {
    this.loadPersistent();
  }

  onSaveSession() {
    this.savePersistent();
  }

  onUserSignout() {
    this.savePersistent();
    this.user = null;
    this.settings = {};
    ToastAndroid.show("You are signed out", ToastAndroid.SHORT);
  }

  async savePersistent() {
    console.log('savePersistent');
    AsyncStorage.setItem(this.SESSION_KEY, JSON.stringify({
      UserStore: {
        user: this.user,
        settings: this.settings
      }
    }));
  }

  async loadPersistent() {
    console.log('loadPersistent');
    const value = await AsyncStorage.getItem(this.SESSION_KEY);
    if (value) {
      console.log("Got session data...")
      alt.bootstrap(value);
    } else console.log("No session");
  }

  getSetting(key) {
    return this.getState().settings[key];
  }



}

export default alt.createStore(UserStore, 'UserStore');