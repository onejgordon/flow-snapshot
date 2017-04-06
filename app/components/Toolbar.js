import React, { Component } from 'react';
import { ToolbarAndroid } from 'react-native';

class Toolbar extends Component {

	onActionSelected(position) {
	  if (position === 0) {
	    this.props.navigation.navigate('Settings');
	  } else if (position === 1) {
	    this.props.navigation.navigate('Snapshot');
	  }
	}

	render() {
	    let actions = [
	      {title: 'Settings', icon: require('../images/ic_action_settings.png'), show: 'always'},
	      {title: 'Snapshot', icon: require('../images/ic_action_send.png'), show: 'always'}
	    ];
		return (
        <ToolbarAndroid
              logo={require('../images/logo.png')}
              title="Flow Snapshot"
              actions={actions}
              onActionSelected={this.onActionSelected} />
        )
	}
}

export default Toolbar;