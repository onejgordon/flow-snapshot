import React, { Component } from 'react';
import { ToolbarAndroid, View, StyleSheet, Image } from 'react-native';


class Toolbar extends Component {
    constructor(props) {
        super(props);
    }

    open_drawer() {
    	this.props.navigation.navigate('DrawerOpen');
    }

	onActionSelected(position) {
	  if (position === 0) {
	    this.props.navigation.navigate('Settings');
	  } else if (position === 1) {
	    this.props.navigation.navigate('Agent');
	  }
	}

	render() {
	    let actions = [
	      {title: 'Settings', icon: require('../images/ic_action_settings.png'), show: 'always'},
	      {title: 'Agent', icon: require('../images/ic_action_send.png'), show: 'always'}
	    ];
		return (
			<View>
		        <ToolbarAndroid
		        	  titleColor='#ffffff'
		              logo={require('../images/logo_white.png')}
		              navIcon={require('../images/ic_menu.png')}
		              title="Flow Snapshot"
		              style={styles.toolbar}
		              actions={actions}
		              onIconClicked={this.open_drawer.bind(this)}
		              onActionSelected={this.onActionSelected.bind(this)} />
            </View>
        )
	}
}

var styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#86878A',
    height: 56
  },
});

export default Toolbar;