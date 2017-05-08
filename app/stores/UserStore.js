import alt from '../config/alt';
import UserActions from '../actions/UserActions';
import {AsyncStorage, ToastAndroid} from 'react-native';
import notifications from '../util/notifications';
import constants from '../config/constants';

class UserStore {

  constructor() {
    this.bindActions(UserActions);
    this.user = null;
    this.settings = {};
    this.suggestions = {}; // {people: [], places: [], activities: []}
    this.errorMessage = null;

    // this.bindListeners({
    //   handleUpdateUser: UserActions.UPDATE_USER
    // });
    // this.exportPublicMethods({
    //   getSetting: this.getSetting,
    //   suggestionStoreKey: this.suggestionStoreKey
    // });

  }

  onSetSuggestion(payload) {
    if (payload.key && payload.value) {
      if (!this.suggestions[payload.key]) this.suggestions[payload.key] = {};
      this.suggestions[payload.key][payload.value] = 1;
    }
  }

  onClearSuggestions(payload) {
    this.suggestions = {};
    ToastAndroid.show("Suggestions cleared", ToastAndroid.SHORT);
  }

  onGetSuggestions(payload) {
    console.log("Got suggestions...");
    this.suggestions = payload;
  }

  onUpdateUser(user) {
    console.log('onUpdateUser');
    this.user = user;
    this.errorMessage = null;
  }

  onUpdateUserSetting(payload) {
    console.log('onUpdateUserSetting');
    console.log(payload)
    let reschedule = false;
    if (this.settings == null) this.settings = {};
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
    ToastAndroid.show("Settings saved", ToastAndroid.SHORT);
  }

  onLoadSession(payload) {
    let keys = [];
    let data = JSON.parse(payload);
    if (data.user != null) {
      this.user = data.user;
      keys.push('user');
    }
    if (data.settings != null) {
      this.settings = data.settings;
      keys.push('settings');
    }
    // ToastAndroid.show("Got session keys... " + keys.join(', '), ToastAndroid.SHORT);
  }

  onUserSignout() {
    console.log('user signout complete')
    this.user = null;
    this.settings = {};
    ToastAndroid.show("You are signed out", ToastAndroid.SHORT);
  }

  // Public methods

  static getSetting(key) {
    return this.getState().settings[key];
  }

}

export default alt.createStore(UserStore)
