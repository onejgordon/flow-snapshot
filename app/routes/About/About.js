import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';

class About extends Component {
  static navigationOptions = {
    title: 'About',
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{padding: 10}}>
        <Text>This is an app!</Text>

        <Button
          title="Sign In Page"
          onPress={() => { navigate('SignIn', {}); }} />
      </View>
    )
  }
}

export default About;