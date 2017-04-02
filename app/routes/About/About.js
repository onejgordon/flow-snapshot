import React, { Component } from 'react';
import { Text, Image, View, Button } from 'react-native';
import images from '../../config/images';

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

        <Image
          source={images.logo}
        />

        <Text>This is an app!</Text>

        <Button
          title="Sign In Page"
          onPress={() => { navigate('SignIn', {}); }} />
      </View>
    )
  }
}

export default About;