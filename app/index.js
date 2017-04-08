import React, { Component } from 'react';
import LoggedOut from './layouts/LoggedOut';
import LoggedIn from './layouts/LoggedIn';
import settings from './config/settings';
import UserStore from './stores/UserStore';
import UserActions from './actions/UserActions';
import {GoogleSignin} from 'react-native-google-signin';
import notifications from './util/notifications';


class FlowMobile extends Component {
    constructor(props) {
        super(props);
        this.state = UserStore.getState();
    }

    componentDidMount() {
        UserStore.listen(this.onChange.bind(this));
        UserActions.checkForSession();
    }

    componentWillUnmount() {
        UserStore.unlisten(this.onChange.bind(this));
        UserActions.saveSession();
    }

    nav_mounted(nav) {
        console.log('nav_mounted');
        this.navigator = nav;
        notifications.setup(this.navigator);
    }

    onChange(state) {
        this.setState({
          user: state.user,
          settings: state.settings
        });
    }

    render() {
        if (this.state.user !== null) {
            let sp = {user: this.state.user, settings: this.state.settings};
            return <LoggedIn ref={this.nav_mounted.bind(this)} screenProps={sp} />
        }
        return <LoggedOut />;
    }

};


export default FlowMobile;
