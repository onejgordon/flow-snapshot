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

        notifications.setup(this.navigator);

        let last_scheduled = UserStore.getSetting('last_scheduled_reminder');
        let rpw = UserStore.getSetting('reminders_per_week');
        let start_hr = UserStore.getSetting('reminder_start_hr');
        let end_hr = UserStore.getSetting('reminder_end_hr');
        console.log([last_scheduled, rpw, start_hr, end_hr]);
        // TODO: Run in boot receiver too
        last_scheduled = notifications.schedule_all_reminders_for_week(rpw, last_scheduled, start_hr, end_hr);
        if (last_scheduled) UserActions.updateUserSetting({'last_scheduled_reminder': last_scheduled});
    }

    componentWillUnmount() {
        UserStore.unlisten(this.onChange.bind(this));
        UserActions.saveSession();
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
            return <LoggedIn ref={nav => { this.navigator = nav; }} screenProps={sp} />;
        }
        return <LoggedOut />;
    }

};


export default FlowMobile;
