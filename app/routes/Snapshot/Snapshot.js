import React, { Component } from 'react';
import { Text, TextInput, Picker, Button, View, Slider,
  TouchableOpacity, ToastAndroid, ListView,
  StyleSheet, ScrollView } from 'react-native';
import Toolbar from '../../components/Toolbar';
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
      people_ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      form: {
        people: ''
      },
      position: null,
      submitting: false
    };
    this.watchID = null;
    this.USE_AUTOCOMPLETE = false;
    this.SELECT_PH_VALUE = "Select one...";
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
    this.setState({submitting: true}, () => {
      api.post(screenProps.user, screenProps.settings.api_pw, '/api/snapshot', params, (res) => {
        let st = {submitting: false};
        if (res.success) {
          st.form = {};
        }
        this.setState(st);
        let sett = screenProps.settings;
        notifications.schedule_all_reminders_for_week(
          sett.reminders_per_week,
          sett.start_hr,
          sett.end_hr
        );
        this.props.navigation.navigate('Home');
        ToastAndroid.show(res.message, ToastAndroid.SHORT);
      });

    });
  }

  onTyping() {

  }

  add_person(name) {
    let {people_ds, people} = this.state;
    if (name == this.SELECT_PH_VALUE) return;
    console.log(`Add person ${name}`);
    if (people.indexOf(name) == -1) people = people.concat([name]);
    this.setState({
      people_ds: this.state.people_ds.cloneWithRows(people),
      people: people
    });
  }

  rating_change(key, value) {
    let {form} = this.state;
    form[key] = value;
    this.setState({form});
  }

  get_suggestions(key, query) {
    let std_suggestions = [];
    if (key == 'where') std_suggestions = ['Home', 'Office', 'Restaurant', 'Store', 'Friend\'s House'];
    else if (key == 'people') std_suggestions = ["By Myself", "In Public"];
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
    let suggestions = std_suggestions.concat(queried_suggestions);
    suggestions.splice(0, 0, this.SELECT_PH_VALUE);
    return suggestions
  }

  render_selection_question(key, qtext, handle_choice, _multi) {
    let multi = _multi == null ? false : _multi;
    const { form } = this.state;
    let suggestions = this.get_suggestions(key, form[key]);
    let content, _text_input;
    let text_value = multi ? this.state[key].join(', ') : this.state[key]||'';
    if (!multi) _text_input = (
      <TextInput
        style={{height: 40}}
        placeholder="Enter response"
        value={text_value}
        onChangeText={handle_choice}
      />
    );
    // if (this.USE_AUTOCOMPLETE) content = (
    //   <AutoComplete
    //     style={styles.autocomplete}
    //     suggestions={suggestions}
    //     placeholder="Start typing..."
    //     clearButtonMode="always"
    //     returnKeyType="go"
    //     textAlign="start"
    //     onTyping={this.onTyping.bind(this)}
    //     onSelect={handle_choice.bind(this)} />
    // )
    content = (
      <View>
        { _text_input }
        <Picker
          prompt={qtext}
          selectedValue={this.SELECT_PH_VALUE}
          onValueChange={handle_choice}>
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
    if (activity == this.SELECT_PH_VALUE) return;
    console.log('activity -> ' + activity);
    this.setState({activity: activity});
  }

  set_where(where) {
    if (where == this.SELECT_PH_VALUE) return;
    console.log('where -> ' + where);
    this.setState({where: where});
  }

  render_where() {
    let {position} = this.state;
    let position_text = "--";
    if (position) position_text = position.coords.latitude + ", " + position.coords.longitude;
    return (
      <View>
        <Text>{ position_text }</Text>
        { this.render_selection_question('where', "Where are you?", this.set_where.bind(this)) }
      </View>
    );
  }

  render_activity() {
    return this.render_selection_question('activity', "What are you doing?", this.set_activity.bind(this))
  }

  render_people() {
    return (
      <View>
        <Text style={styles.h2}>People</Text>
        <ListView
            dataSource={this.state.people_ds}
            renderRow={(p) => <Text style={styles.person_li}>{p}</Text>}
          />
        { this.render_selection_question('people', "Who are you with?", this.add_person.bind(this), true) }
      </View>
    );
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
    let {submitting} = this.state;
    return (
      <View style={{flex: 1}}>

        <Toolbar navigation={this.props.navigation} />

        <ScrollView style={{padding: 15}}>

          { this.render_where() }
          { this.render_activity() }
          { this.render_people() }
          { this.render_rating() }

          <View style={{marginBottom: 30}}>
          <Button
            disabled={submitting}
            onPress={this.submit.bind(this)}
            title="Submit"
            color="#000000"
          />
          </View>

        </ScrollView>
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
  h2: {
    fontSize: 18
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
  person_li: {
    padding: 10
  },
});

Snapshot.propTypes = {
};

export default Snapshot;