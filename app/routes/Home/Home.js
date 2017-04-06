import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import images from '../../config/images';

class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
  	return (
	    <View style={{padding: 10, backgroundColor: "#EFEFEF", flex: 1, justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
        <Image onPress={this.props.navigation.navigate.bind(this, 'DrawerOpen')} source={images.logo}/>
	      <Text style={{color: 'black'}}>You're home!</Text>
	    </View>
	  );
  }
};

export default Home;