import React, { Component } from 'react';
import { Button, StyleSheet } from 'react-native';

class FlowButton extends Component {
    constructor(props) {
        super(props);
    }

	render() {
		return <Button color="#C22968" style={styles.button} {...this.props} />
	}
}

var styles = StyleSheet.create({
	button: {
		height: 20
	}
});

export default FlowButton;