import React, { Component } from 'react';
import { Text, TextInput, Picker, Button, View, Slider,
  TouchableOpacity, ToastAndroid, ListView,
  StyleSheet, ScrollView } from 'react-native';
import UserActions from '../../actions/UserActions';
import Toolbar from '../../components/Toolbar';
import constants from '../../config/constants';
import api from '../../util/api';
import util from '../../util/util';
import notifications from '../../util/notifications';
import FlowButton from '../../components/FlowButton';

class Snapshot extends Component {
  static navigationOptions = {
    tabBar: {
      label: 'Snapshot',
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      place: '',
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
    this.SELECT_PH_VALUE = "[ Select one... ]";
  }

  componentDidMount() {
    let {screenProps} = this.props;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({position});
      },
      (error) => console.log(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      console.log(position);
      this.setState({position});
    });
    UserActions.getSuggestions(screenProps.user);
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  componentDidUpdate(prevProps, prevState) {
  }

  submit() {
    let {screenProps} = this.props;
    let {form, position} = this.state;
    let params = {
      activity: this.state.activity,
      place: this.state.place,
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

  change_form_input(key, text) {
    let {form} = this.state;
    form[key] = text;
    this.setState({form});
  }

  handle_set_button(key, multi, manually_entered, value) {
    let {screenProps} = this.props;
    if (value == this.SELECT_PH_VALUE || value == null) return;
    let st = {};
    let {form} = this.state;
    value = util.title_case(value);
    form[key] = '';
    st[key] = value;
    st.form = form;
    console.log(key + ' -> ' + value);
    this.setState(st, () => {
      if (manually_entered) {
        // Add to suggestions if not already present
        UserActions.setSuggestion(screenProps.user, key, value);
      }
    });
  }

  add_person(manually_entered, name) {
    let {people_ds, people} = this.state;
    if (name == this.SELECT_PH_VALUE) return;
    console.log(`Add person ${name}`);
    name = util.title_case(name);
    if (people.indexOf(name) == -1) people = people.concat([name]);
    this.setState({
      people_ds: this.state.people_ds.cloneWithRows(people),
      people: people
    }, () => {
      if (manually_entered) {
        // Add to suggestions if not already present
        UserActions.setSuggestion({key: 'people', value: name});
      }
    });
  }

  remove_person(name) {
    let {people_ds, people} = this.state;
    console.log(`Remove person ${name}`);
    let idx = people.indexOf(name);
    if (idx > -1) {
      people.splice(idx, 1);
      this.setState({
        people_ds: this.state.people_ds.cloneWithRows(people),
        people: people
      });
    }
  }

  add_entered_person(name) {
    let {form} = this.state;
    this.add_person(form.people);
  }

  rating_change(key, value) {
    let {form} = this.state;
    form[key] = value;
    this.setState({form});
  }

  get_suggestions(key, query) {
    let {screenProps} = this.props;
    let std_suggestions = [];
    if (key == 'place') std_suggestions = ['Home', 'Office', 'Restaurant', 'Store', 'Friend\'s House'];
    else if (key == 'people') std_suggestions = ["By Myself", "In Public", "Coworkers"];
    else if (key == 'activity') std_suggestions = [
      'Working',
      'Meeting',
      'On a Call',
      'Shopping',
      'Reading',
      'Eating',
      'Hanging Out'
    ];
    let suggs = screenProps.suggestions;
    let queried_suggestions = []
    if (suggs) {
      console.log('suggs for ' + key);
      let key_suggs = suggs[key];
      if (key_suggs != null) {
        console.log(Object.keys(key_suggs));
        queried_suggestions = Object.keys(key_suggs);
      }
    }
    let suggestions = std_suggestions.concat(queried_suggestions);
    suggestions.splice(0, 0, this.SELECT_PH_VALUE);
    return suggestions
  }

  render_person_li(p) {
    return (
      <TouchableOpacity onPress={this.remove_person.bind(this, p)} >
        <Text style={styles.person_li}>{p}</Text>
      </TouchableOpacity>
    );
  }

  render_selection_question(key, qtext, handle_choice, _multi, list_datasource, list_render_li) {
    let multi = _multi == null ? false : _multi;
    const { form } = this.state;
    let suggestions = this.get_suggestions(key, form[key]);
    let content, _text_input, _value_section;
    let text_value = multi ? this.state[key].join(', ') : this.state[key]||'';
    if (multi) {
      _value_section = (
        <ListView
          dataSource={list_datasource}
          renderRow={list_render_li}
        />
      );
    } else {
      _value_section = (
        <View>
          <Text style={styles.value}>{ this.state[key] || '--' }</Text>
        </View>
        )
    }
    return (
      <View style={styles.question}>
        <Text style={styles.qText}>{ qtext }</Text>
        <View>

          { _value_section }

          <View flexDirection="row">
            <View flex={2}>
              <TextInput
                style={{height: 40}}
                placeholder={qtext}
                value={form[key]}
                onChangeText={this.change_form_input.bind(this, key)}
              />
            </View>

            <View flex={1}>
              <FlowButton
                onPress={handle_choice.bind(this, true, form[key])}
                title="Set"
              />
            </View>
          </View>

          <Picker
            prompt={qtext}
            selectedValue={this.SELECT_PH_VALUE}
            onValueChange={handle_choice.bind(this, false)}>
            { suggestions.map((sugg) => {
              return <Picker.Item key={sugg} label={sugg} value={sugg} />
            })}
          </Picker>
        </View>
      </View>
    );
  }

  render_place() {
    let {position} = this.state;
    let position_text = "--";
    if (position) position_text = position.coords.latitude + ", " + position.coords.longitude;
    return (
      <View>
        <Text>{ position_text }</Text>
        { this.render_selection_question('place', "Where are you?", this.handle_set_button.bind(this, 'place', false)) }
      </View>
    );
  }

  render_activity() {
    return this.render_selection_question('activity', "What are you doing?", this.handle_set_button.bind(this, 'activity', false))
  }

  render_people() {
    return (
      <View>
        { this.render_selection_question('people', "Who are you with?", this.add_person.bind(this), true, this.state.people_ds, this.render_person_li.bind(this)) }
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

          { this.render_place() }
          { this.render_activity() }
          { this.render_people() }
          { this.render_rating() }

          <View style={{marginBottom: 30}}>
            <FlowButton
              disabled={submitting}
              onPress={this.submit.bind(this)}
              title="Submit"
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
  value: {
    fontSize: 22,
    color: '#F5495E'
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
    padding: 10,
    fontSize: 22,
    color: '#F5495E'
  },
});

Snapshot.propTypes = {
};

export default Snapshot;