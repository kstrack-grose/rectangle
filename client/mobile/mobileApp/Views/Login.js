'use strict';

var React = require('react-native');
var Default = require('./Default');
var CardInfo = require('./CardInfo');

var {
  ActivityIndicatorIOS,
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

/**
 * global scope variables
*/
var reqBody = {'email': null, 'password': null};
var obj = {  
  method: 'POST',
  headers: {
     'Content-Type': 'application/json',
   },
  body: JSON.stringify({'email': null, 'password': null})
};

class Login extends Component{
  /**
   * @method to be run upon initialization
   * creates a state object with:
   * isLoading, errorText, emailInputStyle, passwordInptuStyle
  */
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      errorText: '',
      emailInputStyle: styles.textInput,
      passwordInputStyle: styles.textInput,
    };
  }
  /**
   * @method that updates the response object on changes
   * @param {string} 'text': the text that is updated
   * @param {string} 'prop': the property that is updated
  */
  updateProp(text, prop) {
    reqBody[prop] = text;
    obj.body = JSON.stringify(reqBody);
    this.setState((state) => {
      return {
        curText: text
      };
    });
  }
  /**
   * @method to redirec the user to the other auth page
  */
  _otherAuthHandler() {
    var Signup = require('./Signup');
    this.props.navigator.replace({
      title: '',
      component: Signup,
      parentNav: this.props.route.parentNav
    });
  }
  /**
   * @method that handles the HTTP response with validation and AsyncStorage
   * @param {object} 'response': the response from the HTTP request
  */
  _responseHandler(response) {
    //save it to localstorage
    if (response.message) {
      obj.body = JSON.stringify({'email': null, 'password': null});
      AsyncStorage.multiSet([['userEmail', reqBody.email], ['cardEmail', response.message]])
      .then(() => {
        this.props.navigator.replace({
          title: '',
          component: Default,
          parentNav: this.props.route.parentNav
        });
      });
    } else if (response.redirect) {
      AsyncStorage.setItem('userEmail', reqBody.email)
      .then(() => {
        this.props.navigator.replace({
          title: '',
          component: CardInfo,
          parentNav: this.props.route.parentNav
        });
      });
    } else if (response.error === "password does not match") {
        // password incorrect
        this.state.passwordInputStyle = styles.wrongInput;
        this.state.emailInputStyle = styles.textInput;
        // provide visual feedback: tint input red
        if(JSON.parse(obj.body).password === null){
          this.state.errorText = 'Please enter a password';
        } else {
          this.state.errorText = 'incorrect password';
        }
        
    } else {
        // email does not exist in the db
        this.state.emailInputStyle = styles.wrongInput;
        if(JSON.parse(obj.body).email === null){
          this.state.errorText = 'Please insert an email'
        } else {
          this.state.errorText = 'email is not registered'
        }
    }
    // no matter what, we're done loading
    this.setState((state) => {
      return {
        isLoading: false
      };
    });
  }
  /**
   * @method that creates the HTTP request to the server
  */
  _sendRequest() {
    this.setState((state) => {
      return {
        isLoading: true
      };
    });
    fetch('https://tranquil-earth-7083.herokuapp.com/users/signin', obj)
      .then(response => response.json())
      .then((resJson) => {
        console.log('response is:', typeof resJson, 'Login.js', 137);
        this._responseHandler(resJson);
        return resJson;
      })
      .catch((err) => {
        console.log(new Error(err));
      });
  }
  /**
   * @method to render a view with email and password fields
   * along with a send and a redirect button
  */
  render(){
    var spacer = <View style={styles.spacer}/>;
    var spacerHeader = <View style={styles.spacerHeader}/>;
    var spinner = this.state.isLoading ?
      ( <ActivityIndicatorIOS
          hidden='true'
          size='large'
          color='#ffffff'/> ) :
      ( <View/>);
    return (
      <View style={styles.container}>
        <ScrollView style={styles.wrapper}>
          {spacerHeader}
          <View style={styles.header}>
            <Text style={styles.titleText}>r e c t a n g l e</Text>
          </View>
          <TextInput
              autoFocus={true}
              style={this.state.emailInputStyle}
              autoCapitalize={false}
              autoCorrect={false}
              keyboardType='email-address'
              clearButtonMode={'while-editing'}
              placeholder='Email'
              onChange={(event) => 
                this.updateProp(event.nativeEvent.text,'email')
              }/>
          <TextInput
              style={this.state.passwordInputStyle}
              clearButtonMode={'while-editing'}
              placeholder='Password'
              secureTextEntry={true}
              onChange={(event) => 
                this.updateProp(event.nativeEvent.text,'password')
              }/>
          <View style={styles.footer}>
            <TouchableHighlight 
              style={styles.button}
              underlayColor={'#99d9f4'}
              onPress={(event) => 
                this._sendRequest()}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableHighlight>

          <TouchableHighlight
            style={styles.redirectButton}
            onPress={() => this._otherAuthHandler()}
            underlayColor={'#99d9f4'}>
            <Text style = {styles.redirectButtonText}>
              New user?
            </Text>
          </TouchableHighlight>
          </View>
          <View style={styles.errContainer}>
          <Text style={styles.errorText}>{this.state.errorText}</Text>
            {spinner}
          </View>
        {spacer}
        </ScrollView>
      </View>
      );
    }
};

var styles = StyleSheet.create({
  button: {
    flex: 3,
    margin: 15,
    marginTop: 50,
    padding: 10,
    backgroundColor: 'rgba(61,125,168,0.3)',
    borderColor: '#1B374A',
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: 'stretch',
    justifyContent: 'center',
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    }
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
  errContainer: {
    alignItems: 'center',
  },
  errorText: {
    paddingBottom:20,
    color:'#d5d5d5',
  },
  footer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#1B374A',
    justifyContent: 'flex-end'
  },
  header: {
    backgroundColor: '#1B374A',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moveRight: {
    flex: 2,
  },
  redirectButton: {
    flex: 1,
    margin: 15,
    padding: 5,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  redirectButtonText: {
    fontSize: 16,
    color: '#ffffff',
    alignSelf: 'center'
  },
  spacer:{
    flex: 7,
    paddingTop: 250,
    backgroundColor: '#1B374A'
  },

  textInput: {
    height: 36,
    paddingLeft: 10,
    margin: 2,
    marginRight: 15,
    marginLeft: 15,
    fontSize: 18,
    borderWidth: 0.4,
    borderColor: '#d6d7da',
    backgroundColor: '#ffffff',
    color: '#404040'
  },
  titleText: {
    padding: 32,
    margin: 24,
    color: 'white',
    fontSize: 32,
    fontWeight: '400'
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column'
  },
  wrongInput:{
    height: 36,
    paddingLeft: 10,
    marginRight: 15,
    marginLeft: 15,
    fontSize: 18,
    borderWidth: 0.6,
    borderColor: 'red',
    backgroundColor: '#ffffff',
    color: '#404040'
  },
});

module.exports = Login;
