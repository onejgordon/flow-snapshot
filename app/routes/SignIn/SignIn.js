import React, { Component } from 'react';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import UserActions from '../../actions/UserActions';
import secrets from '../../config/secrets';

class SignIn extends Component {
    static navigationOptions = {
        title: 'Sign In To Flow',
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    _signIn() {
        GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
            // play services are available. can now configure library
            GoogleSignin.configure({
              iosClientId: '', // only for iOS
              webClientId: secrets.WEB_CLIENT_ID
            })
            .then(() => {
                GoogleSignin.signIn().then((user) => {
                    UserActions.updateUser(user);
                }).catch((err) => {
                    console.error('WRONG SIGNIN', err);
                })
            });

        })
    }

    render() {
        return (
            <GoogleSigninButton
                style={{width: 250, height: 48}}
                color={GoogleSigninButton.Color.Light}
                onPress={this._signIn.bind(this)}/>
            )
    }
}

export default SignIn;