import alt from '../config/alt';
import UserActions from '../actions/UserActions';

export class UserStore {

  constructor() {
    this.user = null;
    this.errorMessage = null;

    this.bindListeners({
      handleUpdateUser: UserActions.UPDATE_USER
    });
  }

  handleUpdateUser(user) {
    this.user = user;
    this.errorMessage = null;
  }

}

export default alt.createStore(UserStore, 'UserStore');