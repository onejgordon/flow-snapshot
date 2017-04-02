import React, { Component } from 'react';
import LoggedOut from './layouts/LoggedOut';
import LoggedIn from './layouts/LoggedIn';
import settings from './config/settings';
import {GoogleSignin} from 'react-native-google-signin';

class FlowMobile extends Component {
    constructor(props) {
        super(props);
        this.state = {user: null};
    }

    componentDidMount() {
        GoogleSignin.currentUserAsync().then((user) => {
            console.log('USER', user);
            this.setState({user: user});
        }).done();
    }

    render() {
        if (this.state.user !== null) {
            return <LoggedIn />;
        }
        return <LoggedOut />;
    }

};


export default FlowMobile;
