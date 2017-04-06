import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import images from '../../config/images';
import Toolbar from '../../components/Toolbar';


class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let st = {
      padding: 10,
      backgroundColor: "#EFEFEF",
      flex: 1,
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center'
    };
  	return (
	    <View style={st}>
        <Toolbar navigation={this.props.navigation} />
        <TouchableOpacity onPress={this.props.navigation.navigate.bind(this, 'DrawerOpen')} >
          <Image source={images.logo}/>
        </TouchableOpacity>
	    </View>
	  );
  }
};

export default Home;