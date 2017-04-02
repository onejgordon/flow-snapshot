import alt from '../config/alt';
import MessageActions from '../actions/UserActions';

export class UserStore {

  constructor() {
    this.user = null;
    this.errorMessage = null;

    this.bindListeners({
      handleUpdateUser: MessageActions.UPDATE_USER
    });
  }

  handleUpdateUser(user) {
    this.user = user;
    this.errorMessage = null;
  }

}

export default alt.createStore(UserStore, 'UserStore');