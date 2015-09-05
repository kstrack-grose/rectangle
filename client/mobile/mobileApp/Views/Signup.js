'use strict';

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

var Signup =  React.createClass({
  t: {t:'1'},
  render: function(){
    var spacer = <View style={styles.spacer}/>;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.wrapper}>
          <View style={styles.header}>
            <Text style={styles.titleText}>Sign Up</Text>
          </View>
          <TextInput
              autoFocus={true}
              style={styles.textInput}
              placeholder='Name'
               onChange={(event) => 
                this.updateProp(event.nativeEvent.text,'firstName')
              }/>
          <TextInput
              style={styles.textInput}
              placeholder='Last'
              onChange={(event) => 
                this.updateProp(event.nativeEvent.text,'lastName')
              }/>
          <TextInput
              style={styles.textInput}
              keyboardType='email-address'
              placeholder='Email'
              onChange={(event) => 
                this.updateProp(event.nativeEvent.text,'email')
              }/>
          <TextInput
              style={styles.textInput}
              placeholder='Password'
              secureTextEntry={true}
              onChange={(event) => 
                this.updateProp(event.nativeEvent.text,'password')
              }/>
          <View style={styles.footer}>
            <View style={styles.moveRight}>
            </View>
            <TouchableHighlight style={styles.button}
                 onPress={this.onSend}
                 underlayColor='orange'>
               <Text style={styles.buttonText}>
                  Send
               </Text>
             </TouchableHighlight>
          </View>
        {spacer}
        </ScrollView>
      </View>
    );
  },
  onInputChanged: function(event) {
    this.setState({ input: event.nativeEvent.text });
  },
  updateProp: function(text,prop) {
    reqBody[prop] = text;
    obj.body = JSON.stringify(reqBody);
    this.setState((state) => {
      return {
        curText: text
      };
    });
  },
  onSend: function() {
    AsyncStorage.setItem('userEmail': 
      fetch('https://tranquil-earth-7083.herokuapp.com/users/signup', obj)  
      .then(function(res) {
        test += JSON.stringify(res);
        return res.json();
       })
    )
  }
}); 

var styles = StyleSheet.create({
  button: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderColor: '#1abc9c',
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: '#1abc9c',
    alignSelf: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#1abc9c',
  },
  containerBox: {
    flex: 1,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor: '#1abc9c',
    margin: 0,
    marginVertical: 0,
    overflow: 'hidden',
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#1abc9c',
    justifyContent: 'flex-end'
  },
  header: {
    backgroundColor: '#1abc9c',
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
    backgroundColor: '#1abc9c'
  },
  textInput: {
    height: 36,
    padding: 10,
    margin: 15,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#d6d7da',
    borderRadius: 8,
    backgroundColor: '#d6d7da',
    color: '#1abc9c'
  },
  titleText: {
    padding: 24,
    color: 'white',
    fontSize: 24,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column'
  }
});

module.exports = Signup;

