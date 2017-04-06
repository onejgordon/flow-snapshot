import alt from '../config/alt';
import UserActions from '../actions/UserActions';
import {AsyncStorage, ToastAndroid} from 'react-native';
import notifications from '../util/notifications';

class UserStore {

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
    let reschedule = false;
    Object.keys(payload).forEach((k) => {
      this.settings[k] = payload[k];
      if (['start_hr', 'end_hr', 'reminders_per_week'].indexOf(k) > -1) reschedule = true;
    })
    if (reschedule) {
      notifications.schedule_all_reminders_for_week(
        this.settings.reminders_per_week,
        this.settings.start_hr,
        this.settings.end_hr
      );
    }

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
    console.log(this.settings);
    let value = JSON.stringify({
      UserStore: {
        user: this.user,
        settings: this.settings
      }
    });
    console.log(value);
    await AsyncStorage.setItem(this.SESSION_KEY, value);
  }

  async loadPersistent() {
    console.log('loadPersistent');
    const value = await AsyncStorage.getItem(this.SESSION_KEY);
    if (value) {
      console.log("Got session data...")
      console.log(value);
      alt.bootstrap(value);
    } else console.log("No session");
  }

  getSetting(key) {
    return this.getState().settings[key];
  }

}

export default alt.createStore(UserStore, 'UserStore');
