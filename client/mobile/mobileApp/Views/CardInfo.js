'use strict';

var Orientation = require('react-native-orientation');
var Default = require('./Default');
var React = require('react-native');

var {
  AppRegistry,
  AsyncStorage,
  Component,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} = React;

var reqBody = {};

var obj = {  
  method: 'POST',
  headers: {
     'Content-Type': 'application/json',
   },
  body: {}
}

class CardInfo extends Component{

  constructor(props){
    super(props);
    this.state = {
      loaded: false
    };
  };

  componentDidMount(){
    Orientation.lockToPortrait();
    this.getCardInfo();
  };

  getCardInfo(){
    AsyncStorage.multiGet(['firstName', 'lastName', 'userEmail'])
    .then((values) => {
      var card = {
        firstName: values[0][1],
        lastName: values[1][1],
        email: values[2][1]
      };
      reqBody = card;
      this.setState({
        loaded: true,
        card: reqBody
      });
    })
  };
  /**
   * Method that updates the binded data whenever it is changed
   * @param {event} 
  */
  onInputChanged(event) {
    this.setState({ input: event.nativeEvent.text });
  };
  /**
   * Method that updates the response object on changes
   * @param {string} 'text': the text that is updated
   * @param {string} 'prop': the property that is updated
  */
  updateProp(text,prop) {
    reqBody[prop] = text;
    obj.body = JSON.stringify(reqBody);
    this.setState((state) => {
      return {
        curText: text
      };
    });
  };
  /**
   * Method that creates the HTTP request to the server
  */
  onSend() {
    AsyncStorage.getItem('userEmail')
    .then((email) => {
      this.updateProp(email, 'userEmail');
    })
    .then(() => fetch('https://tranquil-earth-7083.herokuapp.com/cards/createcard', obj))
    .then((response) => {
      return AsyncStorage.setItem('cardEmail', reqBody['email']);
    })
    .then(() => {
      console.log('saved cardEmail to AsyncStorage', 'CardInfo.js', 131);
      this._defaultHandler.bind(this)();
    })
    .catch((err) => {
      console.log(new Error(err));
    });
  };
  /**
   * Method that redirects to default upon HTTP request has 
   * been sent
  */
  _defaultHandler(){
    this.props.navigator.push({
      title: '',
      component: Default
    })
  };
  /**
   * Method that returns an intermediate loading page
  */
  _renderLoading(){
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>Loading your card</Text>
      </View>
    );
  }
  /**
   * Method, no parameters, renders the page with text inputs and a send button
  */
  render(){
    var spacer = <View style={styles.spacer}/>;

    if(this.state.loaded){
      return (
        <View style={styles.container}>
          <ScrollView style={styles.wrapper}>
            <View style={styles.header}>
              <Text style={styles.titleText}>Create a business card</Text>
            </View>
            <TextInput
                autoFocus={true}
                style={styles.textInput}
                placeholder='First Name'
                value={this.state.card.firstName}
                onChange={(event) => 
                  this.updateProp(event.nativeEvent.text,'firstName')
                }/>
            <TextInput
                style={styles.textInput}
                placeholder='Last Name'
                value={this.state.card.lastName}
                onChange={(event) => 
                  this.updateProp(event.nativeEvent.text,'lastName')
                }/>
            <TextInput
                style={styles.textInput}
                placeholder='Email'
                value={this.state.card.email}
                onChange={(event) => 
                  this.updateProp(event.nativeEvent.text,'email')
                }/>
            <TextInput
                style={styles.textInput}
                placeholder='Phone'
                onChange={(event) => 
                  this.updateProp(event.nativeEvent.text,'phone')
                }/>
            <TextInput
                style={styles.textInput}
                placeholder='Company'
                onChange={(event) => 
                  this.updateProp(event.nativeEvent.text,'company')
                }/>
            <TextInput
                style={styles.textInput}
                placeholder='Job Title'
                onChange={(event) => 
                  this.updateProp(event.nativeEvent.text,'jobTitle')
                }/>
            <View style={styles.footer}>
              <View style={styles.moveRight}>
              </View>
              <TouchableHighlight 
                style={styles.button}
                onPress={(event) =>
                  this.onSend()
                }
                underlayColor={'rgba(61,125,168,0.1)'}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableHighlight>
            </View>
          {spacer}
          </ScrollView>
        </View>
      );
    } else {
      return this._renderLoading();
    }
  };
};

var styles = StyleSheet.create({
  button: {
    flex: 1,
    margin: 15,
    padding: 10,
    backgroundColor: 'rgba(61,125,168,0.3)',
    borderColor: '#1B374A',
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
    alignSelf: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#1B374A',
  },
  containerBox: {
    flex: 1,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor: '#1B374A',
    margin: 0,
    marginVertical: 0,
    overflow: 'hidden',
  },
  footer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#1B374A',
    justifyContent: 'flex-end'
  },
  header: {
    backgroundColor: '#1B374A',
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moveRight: {
    flex: 2,
  },
  spacer:{
    paddingTop: 250,
    backgroundColor: '#1B374A'
  },
  textInput: {
    height: 36,
    padding: 10,
    marginRight: 15,
    marginLeft: 15,
    fontSize: 18,
    borderWidth: 0.4,
    borderColor: '#d6d7da',
    backgroundColor: '#ffffff',
    color: '#404040'
  },
  titleText: {
    padding: 24,
    color: 'white',
    fontSize: 32,
    fontWeight: '400'
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column'
  }
});

module.exports = CardInfo;