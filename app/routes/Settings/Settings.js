import React, { Component } from 'react';
import { Image, Button, Text, TextInput, View } from 'react-native';
import UserActions from '../../actions/UserActions';
import UserStore from '../../stores/UserStore';

class Settings extends Component {
  static navigationOptions = {
    tabBar: {
      label: 'Settings',
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      form: {
        reminders_per_week: '',
        api_pw: ''
      }
    };
  }

  componentDidMount() {
    this.setState({form: {
      api_pw: UserStore.getSetting('api_pw'),
      reminders_per_week: UserStore.getSetting('reminders_per_week')
    }})
  }

  save() {
    console.log('save');
    UserActions.updateUserSetting(this.state.form);
  }

  handle_change(key, val) {
    let {form} = this.state;
    form[key] = val;
    this.setState({form});
  }

  signout() {
    UserActions.userSignout();
  }

  render() {
    let {form} = this.state;
    let {screenProps} = this.props;
    let _user_signedin;
    if (screenProps.user) _user_signedin = <Text>Signed in as {screenProps.user.email}</Text>
    return (
      <View style={{padding: 10}}>

        { _user_signedin }

        <TextInput
          style={{height: 40}}
          value={form.reminders_per_week || ''}
          placeholder="How many times a week do you want to answer the question?"
          onChangeText={this.handle_change.bind(this, 'reminders_per_week')}
        />
        <TextInput
          style={{height: 40}}
          value={form.api_pw || ''}
          placeholder="Flow API password"
          secureTextEntry={true}
          onChangeText={this.handle_change.bind(this, 'api_pw')}
        />
        <Button
          onPress={this.save.bind(this)}
          title="Submit"
          color="#841584"
        />

        <Button
          onPress={this.signout.bind(this)}
          style={{marginTop: 10}}
          title="Sign Out"
          color="#840728"
        />
      </View>
    )
  }
}

Settings.propTypes = {

};

export default Settings;