import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import images from '../../config/images';
import Toolbar from '../../components/Toolbar';
import notifications from '../../util/notifications';
import {colors} from '../../config/styles';

class Home extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    notifications.setup(this.props.navigator);
  }

  render() {
    let st = {
      padding: 10,
      backgroundColor: colors.background,
      flex: 1,
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center'
    };
    let {screenProps} = this.props;
    let _user_signedin;
    if (screenProps.user) _user_signedin = <View><Text style={{color: 'white', fontSize: 18}}>Signed in as {screenProps.user.email}</Text></View>
  	return (
	    <View style={st}>
        <TouchableOpacity onPress={this.props.navigation.navigate.bind(this, 'DrawerOpen')} >
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image source={images.logo}/>
          </View>
          { _user_signedin }
        </TouchableOpacity>
	    </View>
	  );
  }
};

export default Home;