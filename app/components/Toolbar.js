import React, { Component } from 'react';
import { ToolbarAndroid, View, StyleSheet } from 'react-native';

class Toolbar extends Component {
    constructor(props) {
        super(props);
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
		              logo={require('../images/logo.png')}
		              title="Flow Snapshot"
		              style={styles.toolbar}
		              actions={actions}
		              onActionSelected={this.onActionSelected.bind(this)} />
            </View>
        )
	}
}

var styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#86878A',
    height: 56,
  },
});

export default Toolbar;