import React, { Component } from 'react';
import { AppState, ToastAndroid } from 'react-native';
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
        let st = UserStore.getState();
        st.appState = null;
        this.state = st;
    }

    _userSignedIn() {
        return this.state.user !== null;
    }

    _handleAppStateChange(nextAppState) {
        if (this.state.appState == null || this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground');
            if (!this._userSignedIn()) {
                console.log('No user, attempt to load session');
                UserActions.loadSession();
            }
        }
        this.setState({appState: nextAppState});
    }

    componentDidMount() {
        UserStore.listen(this.onChange.bind(this));
        AppState.addEventListener('change', this._handleAppStateChange.bind(this));
        UserActions.loadSession();
    }

    componentWillUnmount() {
        UserStore.unlisten(this.onChange.bind(this));
        AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
    }

    onChange(state) {
        console.log('FlowMobile.onChange');
        this.setState({
          user: state.user,
          settings: state.settings,
          suggestions: state.suggestions
        });
    }

    render() {
        console.log(['have user: ', this.state.user !== null]);
        if (this._userSignedIn()) {
            let sp = {user: this.state.user, settings: this.state.settings, suggestions: this.state.suggestions};
            return <LoggedIn screenProps={sp} />
        }
        return <LoggedOut />;
    }

};


export default FlowMobile;
