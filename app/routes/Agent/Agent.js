import React, { Component } from 'react';
import { Text, TextInput, Picker, Button, View, Slider,
  TouchableOpacity, ToastAndroid, ListView,
  StyleSheet, ScrollView } from 'react-native';
import Toolbar from '../../components/Toolbar';
import FlowButton from '../../components/FlowButton';
import constants from '../../config/constants';
import api from '../../util/api';
import notifications from '../../util/notifications';
import {colors} from '../../config/styles';

class Agent extends Component {
  static navigationOptions = {
    drawer: {
      label: 'Talk to Flow'
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      messageDs: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      form: {
        message: ''
      },
      sending: false
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  change_text(text) {
    let {form} = this.state;
    form.message = text;
    this.setState({form});
  }

  add_reply(reply) {
    let message = {
      text: reply,
      ts: new Date().getTime(),
      dir: 'in'
    }
    let new_messages = this.state.messages.concat([message]);
    this.setState({
      messages: new_messages,
      messageDs: this.state.messageDs.cloneWithRows(new_messages),
      form: {message: ''},
      sending: false
    });
  }

  add_send(text, cb) {
    let message = {
      text: text,
      ts: new Date().getTime(),
      dir: 'out'
    }
    this.setState({messages: this.state.messages.concat(message), sending: true}, cb);
  }

  send() {
    let {screenProps} = this.props;
    let {form} = this.state;
    let params = {
      message: form.message
    };
    this.add_send(form.message, () => {
      api.post(screenProps.user, screenProps.settings.api_pw, '/api/agent/flowapp/request', params, (res) => {
        if (res.success && res.reply) {
          this.add_reply(res.reply);
        } else {
          ToastAndroid.show("Something odd happened", ToastAndroid.SHORT);
          this.setState({sending: false});
        }
      });
    });
  }

  render_message(msg) {
    let st = {
      flex: 1,
      padding: 10,
      marginTop: 10,
      marginBottom: 10
    };
    st.backgroundColor = (msg.dir == 'in') ? "#8B8D93" : "#FFE474";
    return (
      <View style={st}>
        <Text>{msg.text}</Text>
      </View>
    );
  }

  render_conversation() {
    return (
      <ListView
        dataSource={this.state.messageDs}
        renderRow={this.render_message.bind(this)}
      />
    );
  }

  render() {
    let {form, sending} = this.state;
    return (
      <View>

        <Toolbar navigation={this.props.navigation} />

        <ScrollView style={{padding: 15}}>

          <Text style={{fontSize: 30}}>Talk to Flow</Text>

          { this.render_conversation() }

          <TextInput
            placeholder="Enter your message..."
            returnKeyType="send"
            onSubmitEditing={this.send.bind(this)}
            onChangeText={this.change_text.bind(this)} value={form.message} />

          <FlowButton
            onPress={this.send.bind(this)}
            title="Send"
            disabled={sending}
          />
        </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({

});

Agent.propTypes = {
};

export default Agent;