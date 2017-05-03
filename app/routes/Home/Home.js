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
      backgroundColor: colors.background,
      flex: 1
    };
    let {screenProps} = this.props;
    let _user_signedin;
    if (screenProps.user) _user_signedin = <View><Text style={{color: 'white', fontSize: 18, justifyContent: 'center'}}>Signed in as {screenProps.user.email}</Text></View>
  	return (
	    <View style={st}>
        <Toolbar navigation={this.props.navigation} />

        <TouchableOpacity style={{padding: 10, marginTop: 50}}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image source={images.logo}/>
            { _user_signedin }
          </View>
        </TouchableOpacity>
	    </View>
	  );
  }
};

export default Home;