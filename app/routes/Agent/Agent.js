import React, { Component } from 'react';
import { Text, TextInput, Picker, Button, View, Slider,
  TouchableOpacity, ToastAndroid, ListView,
  StyleSheet, ScrollView } from 'react-native';
import Toolbar from '../../components/Toolbar';
import constants from '../../config/constants';
import api from '../../util/api';
import notifications from '../../util/notifications';


class Agent extends Component {
  static navigationOptions = {
    tabBar: {
      label: 'Agent',
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
      }
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
      form: {message: ''}
    });
  }

  add_send(text, cb) {
    let message = {
      text: text,
      ts: new Date().getTime(),
      dir: 'out'
    }
    this.setState({messages: this.state.messages.concat(message)}, cb);
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
        } else ToastAndroid.show("Something odd happened", ToastAndroid.SHORT);
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
    let {form} = this.state;
    return (
      <View>

        <Toolbar navigation={this.props.navigation} />

        <ScrollView style={{padding: 15}}>

          { this.render_conversation() }

          <TextInput
            placeholder="Enter your message..."
            returnKeyType="send"
            onSubmitEditing={this.send.bind(this)}
            onChangeText={this.change_text.bind(this)} value={form.message} />

          <Button
            onPress={this.send.bind(this)}
            title="Send"
            color="#000000"
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