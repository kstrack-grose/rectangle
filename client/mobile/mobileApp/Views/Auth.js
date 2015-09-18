'use strict';

var Login = require('./Login');
var Orientation = require('react-native-orientation');
var React = require('react-native');
var Signup = require('./Signup');

var {
  AppRegistry,
  Component,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} = React;

class Auth extends Component{
  /**
   * @method to be run upon initialization
   * does not create a specific state object
  */
  constructor(props) {
    super(props);
    Orientation.lockToPortrait();
  }

  /**
   * @method to render a view with login/signup buttons
  */
  render(){
    var spacer=<View style={styles.spacer}/>;
    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.containerBox}>
            <View style={styles.header}>
              <Text style={styles.titleText}>r e c t a n g l e</Text>
            </View>
            <Image
              style={styles.image}
              source={require('image!cards')}
            />
            {spacer}
            <View style={styles.footer}>
              <View style={styles.buttonRow}>
                <View style={styles.buttonFiller}/>
                <TouchableHighlight  
                  style={styles.button}
                  onPress={this._signUpHandler.bind(this)}
                  underlayColor={'rgba(61,125,168,0.1)'}>
                  <Text 
                  style={styles.buttonText}>Sign Up</Text>
                </TouchableHighlight>
                <View style={styles.buttonFiller}/>
              </View>
              <View style={styles.buttonRow}>
                <View style={styles.buttonFiller}/>
                <TouchableHighlight 
                  style={styles.button}
                  onPress={this._loginHandler.bind(this)}
                  underlayColor={'rgba(61,125,168,0.1)'}>
                  <Text 
                  style={styles.buttonText}>Log In</Text>
                </TouchableHighlight>
                <View style={styles.buttonFiller}/>
              </View>
              {spacer}
            </View>
          </View>
        </View>
      </View>
    );
  }

  /**
   * @method that adds the Signup view to the stack
  */
  _signUpHandler(){
    this.props.navigator.push({
      title: '',
      component: Signup
    });
  }

  /**
   * @method that adds the Login view to the stack
  */
  _loginHandler(){
    this.props.navigator.push({
      title: '',
      component: Login
    });
  }
};

var styles = StyleSheet.create({
  button: {
    flex: 2,
    margin: 10,
    padding: 10,
    backgroundColor: 'rgba(61,125,168,0.3)',
    borderColor: '#1B374A',
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: 'stretch',
    justifyContent: 'center'
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
    backgroundColor: 'orange',
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
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  header: {
    backgroundColor: '#1B374A',
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    alignSelf: 'center',
    padding: 20,
    marginBottom: 20,
    flex: 2,
    width: 275,
  },
  spacer:{
    flex: 1,
    backgroundColor: '#1B374A'
  },
  titleText: {
    color: 'white',
    fontSize: 32,
    fontWeight: '400'
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column'
  }
});

module.exports = Auth;
