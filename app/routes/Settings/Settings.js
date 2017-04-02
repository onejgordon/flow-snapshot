import React, { Component } from 'react';
import { Image } from 'react-native';
import { AppRegistry, Text, TextInput, View } from 'react-native';

class Settings extends Component {
  static navigationOptions = {
    tabBar: {
      label: 'Settings',
    }
  }
  constructor(props) {
    super(props);
    this.state = {text: ''};
  }

  render() {
    return (
      <View style={{padding: 10}}>
        <TextInput
          style={{height: 40}}
          placeholder="How many times a week do you want to answer the question?"
          onChangeText={(text) => this.setState({text})}
        />
      </View>
    )
  }
}

Settings.propTypes = {

};

export default Settings;