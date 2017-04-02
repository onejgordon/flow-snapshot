import React, { Component } from 'react';
import { Image } from 'react-native';
import { AppRegistry, Text, TextInput, View } from 'react-native';
import constants from '../../config/constants';

class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {doing: '', who: ''};
  }

  submit() {
    let params = {};
    fetch(constants.flow_base + '/api/snapshot/submit', {
      body: JSON.stringify({
        data: params
      })
    }).then(function(response) {
        return response.json()
    });
  }

  render() {
    return (
      <View style={{padding: 10}}>
        <TextInput
          style={{height: 40}}
          placeholder="What are you doing now?"
          onChangeText={(text) => this.setState({doing})}
        />
        <TextInput
          style={{height: 40}}
          placeholder="Who are you with?"
          onChangeText={(text) => this.setState({who})}
        />
      </View>
    );
  }
}

Report.propTypes = {
};

export default Report;