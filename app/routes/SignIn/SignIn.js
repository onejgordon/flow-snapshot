import React, { Component } from 'react';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import { Text, Image, View, Button } from 'react-native';
import images from '../../config/images';
import UserActions from '../../actions/UserActions';
import secrets from '../../config/secrets';
import {colors} from '../../config/styles';

class SignIn extends Component {
    static navigationOptions = {
        title: 'Sign In To Flow',
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
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
            <View flex={1} style={{justifyContent: 'center', alignItems: 'center', padding: 10, backgroundColor: colors.background}}>

                <Image source={images.logo}/>

                <Text style={{fontSize: 25, padding: 10, color: 'white'}}>Welcome to Flow Snapshot!</Text>

                <GoogleSigninButton
                    style={{width: 250, height: 48}}
                    color={GoogleSigninButton.Color.Light}
                    onPress={this._signIn.bind(this)}/>

            </View>
        );
    }
}

export default SignIn;