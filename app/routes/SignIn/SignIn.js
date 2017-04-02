import React, { Component } from 'react';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
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
        GoogleSignin.configure({
          iosClientId: '', // only for iOS
          webClientId: secrets.CLIENT_ID
        })
        .then(() => {
          // you can now call currentUserAsync()
        });
    }

    render() {
        return (
            <GoogleSigninButton
                style={{width: 250, height: 48}}
                color={GoogleSigninButton.Color.Dark}
                onPress={this._signIn.bind(this)}/>
            )
    }
}

export default SignIn;