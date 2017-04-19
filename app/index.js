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
        console.log('FlowMobile.componentDidMount')
        UserStore.listen(this.onChange.bind(this));
        UserActions.loadSession();
    }

    componentWillUnmount() {
        console.log('FlowMobile.componentWillUnmount')
        UserStore.unlisten(this.onChange.bind(this));
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
        if (this.state.user !== null) {
            let sp = {user: this.state.user, settings: this.state.settings, suggestions: this.state.suggestions};
            return <LoggedIn screenProps={sp} />
        }
        return <LoggedOut />;
    }

};


export default FlowMobile;
