import React, { Component } from 'react';
import LoggedOut from './layouts/LoggedOut';
import LoggedIn from './layouts/LoggedIn';
import settings from './config/settings';
import UserStore from './stores/UserStore';
import {GoogleSignin} from 'react-native-google-signin';
import notifications from './notifications';

class FlowMobile extends Component {
    constructor(props) {
        super(props);
        this.state = UserStore.getState();
    }

    componentDidMount() {
        UserStore.listen(this.onChange.bind(this));
        notifications.setup(this.navigator);

        // Test notif
        notifications.schedule_snapshot(new Date(new Date().getTime() + 30 * 1000)); // 30 secs
    }

    componentWillUnmount() {
        UserStore.unlisten(this.onChange.bind(this));
    }

    onChange(state) {
        console.log(state);
        this.setState({
          user: state.user
        });
    }

    render() {
        if (this.state.user !== null) {
            return <LoggedIn ref={nav => { this.navigator = nav; }} />;
        }
        return <LoggedOut />;
    }

};


export default FlowMobile;
