import React, { Component } from 'react';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import { Text, Image, View, Button } from 'react-native';
import images from '../../config/images';
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
            <View style={{padding: 10}} style={{justifyContent: 'center', alignItems: 'center'}}>

                <Image source={images.logo}/>

                <Text style={{fontSize: 15, padding: 10}}>Welcome to the Flow Dashboard app!</Text>

                <GoogleSigninButton
                    style={{width: 250, height: 48}}
                    color={GoogleSigninButton.Color.Light}
                    onPress={this._signIn.bind(this)}/>

            </View>
        );
    }
}

export default SignIn;