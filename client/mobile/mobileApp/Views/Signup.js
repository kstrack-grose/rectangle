'use strict';

var React = require('react-native');
var CardInfo = require('./CardInfo');
var Login = require('./Login');

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
var reqBody = {'firstName': '', 'lastName': '', 'email': '', 'password': ''};
var obj = {  
  method: 'POST',
  headers: {
     'Content-Type': 'application/json',
   },
  body: JSON.stringify({'firstName': null, 'lastName': null, 'email': null, 'password': null})
}

class Signup extends Component{
  /**
   * Method to be run upon initialization
   * creates a state object with:
   * isLoading, errorText, firstNameInputStyle, lastNameInputStyle, 
   * emailInput Style, passwordInptuStyle
  */
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      errorText: '',
      firstNameInputStyle: styles.textInput,
      lastNameInputStyle: styles.textInput,
      emailInputStyle: styles.textInput,
      passwordInputStyle: styles.textInput,
    };
  }
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
  }
  /**
   * Method to redirec the user to the other auth page
  */
  _otherAuthHandler() {
    this.props.navigator.replace({
      title: '',
      component: Login,
      parentNav: this.props.route.parentNav
    });
  }
  /**
   * Method that handles the HTTP response with validation and AsyncStorage
   * @param {object} 'response': the response from the HTTP request
  */
  _responseHandler(response){
    if(response.message){
      AsyncStorage.multiSet([
        ['userEmail', reqBody.email], 
        ['firstName', reqBody.firstName],
        ['lastName', reqBody.lastName]
        ])
      .then(() => {
        return AsyncStorage.getAllKeys();
      })
      .then((keys) => {
        console.log('keys line 86: ', keys);
        console.log('successfully saved user email:', response.message, 'Signup.js', 97);
        this._cardInfoHandler();
      })
    } else if (response.error){
      this.state.emailInputStyle = styles.wrongInput;
      this.state.errorText = response.error;
    }
    this.setState((state) => {
      return {
        isLoading: false
      };
    });
  }
  /**
   * Method that creates the HTTP request to the server
   * no parameters
   * nothing returned
  */
  _sendRequest() {
    this.setState((state) => {
      return {
        isLoading: true
      };
    });
    fetch('https://tranquil-earth-7083.herokuapp.com/users/signup', obj)  
    .then((res) => res.json())
    .then((resJson) => {
      this._responseHandler(resJson)
      resJson
    })
    .catch((err) => {
      console.log(new Error(err));
    });
  }
  /**
   * Method to check for empty user input and respond with visual feedback
   * no parameters
   * nothing returned
  */
  _validations() {
    if(reqBody.firstName === '' || reqBody.lastName === '' || reqBody.email === '' || reqBody.password === ''){
      this.state.errorText = 'Please leave no blank fields';

      if(reqBody.firstName === ''){
        this.setState((state) => {
          return {
            firstNameInputStyle: styles.wrongInput
          };
        });
      } else {
        this.setState((state) => {
          return {
            firstNameInputStyle: styles.textInput
          };
        });
      }
      if(reqBody.lastName === ''){
        this.setState((state) => {
          return {
            lastNameInputStyle: styles.wrongInput
          };
        });
      } else {
        this.setState((state) => {
          return {
            lastNameInputStyle: styles.textInput
          };
        });
      }
      if(reqBody.email === ''){
        this.setState((state) => {
          return {
            emailInputStyle: styles.wrongInput
          };
        });
      } else {
        this.setState((state) => {
          return {
            emailInputStyle: styles.textInput
          };
        });
      }
      if(reqBody.password === ''){
        this.setState((state) => {
          return {
            passwordInputStyle: styles.wrongInput
          };
        });
      } else {
        this.setState((state) => {
          return {
            passwordInputStyle: styles.textInput
          };
        });
      }
    } else {
      this._sendRequest();
    }
  }
  /**
   * Method to redirect to CardInfo.js
  */
  _cardInfoHandler(){
    this.props.navigator.push({
      title: '',
      component: CardInfo,
      parentNav: this.props.route.parentNav
    });
  }
  /**
   * Method to render a view with name, email, and password fields
   * along with a send and a redirect button
  */
  render(){
    var spacer = <View style={styles.spacer}/>;
    var spacerHeader = <View style={styles.spacerHeader}/>;
    var spacerText = <View style={styles.spacerHeader}/>
    var spinner = this.state.isLoading ?
      ( <ActivityIndicatorIOS
          hidden='true'
          size='large'
          color='#ffffff'/> ) :
      ( <View/>);
    return (
      <View style={styles.container}>
        <ScrollView style={styles.wrapper}>
          <View style={styles.header}>

            <Text style={styles.titleText}>r e c t a n g l e</Text>

          </View>
          <View style={styles.errContainer}>
            <Text style={styles.errorText}>{this.state.errorText}</Text>
              {spinner}
          </View>
          <TextInput
              style={this.state.firstNameInputStyle}
              placeholder='Name'
              autoCapitalize={true}
              autoCorrect={false}
              clearButtonMode={'while-editing'}
              onChange={(event) => 
                this.updateProp(event.nativeEvent.text,'firstName')
              }/>
          <TextInput
              style={this.state.lastNameInputStyle}
              placeholder='Last'
              autoCapitalize={true}
              autoCorrect={false}
              clearButtonMode={'while-editing'}
              onChange={(event) => 
                this.updateProp(event.nativeEvent.text,'lastName')
              }/>
          <TextInput
              style={this.state.emailInputStyle}
              autoCapitalize={false}
              autoCorrect={false}
              keyboardType='email-address'
              placeholder='Email'
              clearButtonMode={'while-editing'}
              onChange={(event) => 
                this.updateProp(event.nativeEvent.text,'email')
              }/>
          <TextInput
              style={this.state.passwordInputStyle}
              placeholder='Password'
              clearButtonMode={'while-editing'}
              secureTextEntry={true}
              onChange={(event) => 
                this.updateProp(event.nativeEvent.text,'password')
              }/>
          
          <View style={styles.footer}>
            <TouchableHighlight style={styles.button}
                 onPress={() => this._validations()}
                 underlayColor={'#99d9f4'}>
              <Text style={styles.buttonText}>
                  Sign Up
              </Text>
            </TouchableHighlight>
        
            <TouchableHighlight
              style={styles.redirectButton}
              onPress={() => this._otherAuthHandler()}
              underlayColor={'#99d9f4'}>
              <Text style = {styles.redirectButtonText}>
                Already have an account?
              </Text>
            </TouchableHighlight>
          </View>
          {spacer}
          
        </ScrollView>
      </View>
    );
  }
}; 

/**
 * React Native style sheet clone
*/
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
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonFiller: {
    flex: 1,
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
  errContainer: {
    alignItems: 'center',
  },
  errorText: {
    paddingBottom: 20,
    color:'#e67e22',
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
    paddingTop: 150,
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
    paddingTop: 32,
    paddingBottom: 32,
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
    margin: 2,
    marginRight: 15,
    marginLeft: 15,
    fontSize: 18,
    borderWidth: 6,
    borderColor: '#e67e22',
    borderRadius: 2,
    backgroundColor: '#ffffff',
    color: '#404040'
  },
});

module.exports = Signup;

