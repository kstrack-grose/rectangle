'use strict';

var Auth = require('./Auth');
var Orientation = require('react-native-orientation');
var React = require('react-native');

var {
  AsyncStorage,
  Component,
  StyleSheet,
  View,
} = React;

class Logout extends Component{
  /**
   * Method to be run upon initialization
   * doesn't create anything in the state
  */
  constructor(props) {
    super(props);
    Orientation.lockToPortrait();
    this._logOut();
  }
  /**
   * Method to log the user out and
   * redirect to Auth page
   * nothing returned
  */
  _logOut() {
    AsyncStorage.multiRemove(['userEmail', 'firstName', 'lastName', 'cardEmail'])
    .then(() => {
      this.props.navigator.replace({
        title: '',
        component: Auth
      });
    })
    .catch((err) => {
      console.log(new Error(err));
    });
  }
  /**
   * Method to render a blank view
  */
  render() {
    return <View style={styles.container}>
      <View style={styles.containerBox}>
      </View>
    </View>
  }

};

var styles = StyleSheet.create({
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
  wrapper: {
    flex: 1,
    flexDirection: 'column'
  }
});

module.exports = Logout;
