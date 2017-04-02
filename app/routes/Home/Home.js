import React, { Component } from 'react';
import { Text, View } from 'react-native';

class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
  	return (
	    <View style={{padding: 10}}>
	      <Text>You're home!</Text>
	    </View>
	  );
  }
};

export default Home;