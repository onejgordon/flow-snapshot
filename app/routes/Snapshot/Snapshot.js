import React, { Component } from 'react';
import Autocomplete from 'react-native-autocomplete-input';
import { Text, TextInput, Button, View, Slider,
  TouchableOpacity,
  StyleSheet } from 'react-native';
import constants from '../../config/constants';


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
      }
    };
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

  handle_autocomplete_change(key, text) {
    let {form} = this.state;
    form.key = text;
    this.setState({form});
  }

  add_person(name) {
    let {people} = this.state;
    if (people.indexOf(name) == -1) people.push(name);
    this.setState({people});
  }

  get_suggestions(key, query) {
    return []; // TODO
  }

  render_selection_question(key, qtext, handle_choice) {
    const { form } = this.state;
    let data = this.get_suggestions(key, form[key]);
    return (
      <View>
        <Text style={styles.qText}>{ qtext }</Text>
        <View style={styles.autocompleteContainer}>
            <Autocomplete
              data={data}
              defaultValue={form.people}
              onChangeText={(text) => this.handle_autocomplete_change.bind(this, key)}
              renderItem={(data) => {
                return (
                  <TouchableOpacity onPress={() => this.handle_choice.bind(this, data)}>
                    <Text>{data}</Text>
                  </TouchableOpacity>
                )
              }} />
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
    return this.render_selection_question('where', "Where are you?", this.set_where)
  }

  render_activity() {
    return this.render_selection_question('activity', "What are you doing?", this.set_activity)
  }

  render_people() {
    return this.render_selection_question('people', "Who are you with?", this.add_person)
  }

  render_rating() {
    return (
      <View>
        <Text>Happiness</Text>
        <Slider
          maximumValue={10}
          minimumValue={1}
          value={1}
          onValueChange={(value) => this.rating_change.bind(this, 'happiness', value)} />
        <Text>Stress</Text>
        <Slider
          maximumValue={10}
          minimumValue={1}
          value={1}
          onValueChange={(value) => this.rating_change.bind(this, 'happiness', value)} />
      </View>
      )
  }

  render() {
    return (
      <View style={{padding: 10}}>

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
  baseText: {
    fontFamily: 'Cochin',
  },
  qText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1
  }
});

Snapshot.propTypes = {
};

export default Snapshot;