import React, { Component } from 'react';
import AutoComplete from 'react-native-autocomplete';
import { Text, TextInput, Picker, Button, View, Slider,
  TouchableOpacity, ToastAndroid,
  StyleSheet } from 'react-native';
import constants from '../../config/constants';
import api from '../../util/api';
import notifications from '../../util/notifications';

class Snapshot extends Component {
  static navigationOptions = {
    tabBar: {
      label: 'Snapshot',
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      where: '',
      activity: '',
      people: [],
      form: {
        people: ''
      },
      position: null
    };
    this.watchID = null;
    this.USE_AUTOCOMPLETE = false;
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log((position))
        this.setState({position});
      },
      (error) => console.log(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      console.log(position);
      this.setState({position});
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  submit() {
    let {screenProps} = this.props;
    let {form, position} = this.state;
    let params = {
      activity: this.state.activity,
      where: this.state.where,
      people: this.state.people.join(','),
      metrics: JSON.stringify({
        stress: form.stress,
        happiness: form.happiness
      })
    };
    if (position != null) {
      params.lat = position.coords.latitude;
      params.lon = position.coords.longitude;
    }
    api.post(screenProps.user, screenProps.settings.api_pw, '/api/snapshot', params, (res) => {
      if (res.success) {
        this.setState({form: {}});
      }
      ToastAndroid.show(res.message, ToastAndroid.SHORT);
    });
  }

  onTyping() {

  }

  add_person(name) {
    let {people} = this.state;
    if (people.indexOf(name) == -1) people.push(name);
    this.setState({people});
  }

  rating_change(key, value) {
    let {form} = this.state;
    form[key] = value;
    this.setState({form});
  }

  get_suggestions(key, query) {
    let std_suggestions = [];
    if (key == 'where') std_suggestions = ['Home', 'Office', 'Restaurant', 'Store', 'Friend\'s House'];
    else if (key == 'people') std_suggestions = ["By Myself"];
    else if (key == 'activity') std_suggestions = [
      'Working',
      'Meeting',
      'On a Call',
      'Shopping',
      'Reading',
      'Eating',
      'Hanging Out'
    ];
    // TODO: Add query of local db
    let queried_suggestions = []
    return std_suggestions.concat(queried_suggestions);
  }

  render_selection_question(key, qtext, handle_choice, _multi) {
    let multi = _multi == null ? false : _multi;
    const { form } = this.state;
    let suggestions = this.get_suggestions(key, form[key]);
    let content;
    let text_value = multi ? this.state[key].join(', ') : this.state[key]||'';
    if (this.USE_AUTOCOMPLETE) content = (
      <AutoComplete
        style={styles.autocomplete}
        suggestions={suggestions}
        placeholder="Start typing..."
        clearButtonMode="always"
        returnKeyType="go"
        textAlign="start"
        onTyping={this.onTyping.bind(this)}
        onSelect={handle_choice.bind(this)} />
    )
    else content = (
      <View>
        <TextInput
          style={{height: 40}}
          placeholder="Enter response"
          value={text_value}
          onChangeText={handle_choice.bind(this)}
        />
        <Picker
          onValueChange={handle_choice.bind(this)}>
          { suggestions.map((sugg) => {
            return <Picker.Item key={sugg} label={sugg} value={sugg} />
          })}
        </Picker>
      </View>
    )
    return (
      <View style={styles.question}>
        <Text style={styles.qText}>{ qtext }</Text>
        <View>
          { content }
        </View>
      </View>
    );
  }

  set_activity(activity) {
    this.setState({activity: activity});
  }

  set_where(where) {
    this.setState({where: where});
  }

  render_where() {
    return this.render_selection_question('where', "Where are you?", this.set_where.bind(this))
  }

  render_activity() {
    return this.render_selection_question('activity', "What are you doing?", this.set_activity.bind(this))
  }

  render_people() {
    return this.render_selection_question('people', "Who are you with?", this.add_person.bind(this), true)
  }

  render_rating() {
    let {form} = this.state;
    return (
      <View>
        <Text style={styles.qText}>Happiness</Text>
        <View style={styles.slider}>
          <Slider
            maximumValue={10}
            minimumValue={1}
            value={form.happiness || 1}
            onValueChange={this.rating_change.bind(this, 'happiness')} />
        </View>
        <Text style={styles.qText}>Stress</Text>
        <View style={styles.slider}>
          <Slider
            maximumValue={10}
            minimumValue={1}
            value={form.stress || 1}
            onValueChange={this.rating_change.bind(this, 'stress')} />
        </View>
      </View>
      )
  }

  render() {
    return (
      <View style={{padding: 15}}>

        { this.render_where() }
        { this.render_activity() }
        { this.render_people() }
        { this.render_rating() }

        <Button
          onPress={this.submit.bind(this)}
          title="Submit"
          color="#841584"
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  question: {
    margin: 5
  },
  slider: {
    marginTop: 8,
    marginBottom: 8
  },
  baseText: {
    fontFamily: 'Cochin',
  },
  qText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  autocomplete: {
    alignSelf: 'stretch',
    height: 50,
    marginTop: 10,
    backgroundColor: '#FFF',
    borderColor: 'lightblue',
    borderWidth: 1,
  },
});

Snapshot.propTypes = {
};

export default Snapshot;