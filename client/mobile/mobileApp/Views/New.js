'use strict';

var React = require('react-native');

var {
  AppRegistry,
  Component,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} = React;

var Fields = React.createClass({
  render: function(){
    var spacer = <View style={styles.spacer}/>;
    return (

      <View style={styles.container}>
        <ScrollView
          style={styles.wrapper}>
            <TextInput
                autoFocus={true}
                style={styles.prompt}
                onSubmitEditing={(text) => this.setState({text})}
                /*value={this.state.text}*/
                placeholder='Name...'/>
            <TouchableHighlight style={styles.button}
                 underlayColor='#99d9f4'>
               <Text style={styles.titleText}>
                  Submit
               </Text>
             </TouchableHighlight>
        </ScrollView>
      </View>
    );
  },

});


var styles = StyleSheet.create({
 
  container: {
    backgroundColor: '#e9eaed',
    flex: 1,
    // position: 'absolute', top: 0, bottom: 0, left: 0, right: 0
  },
  prompt: {
    backgroundColor: 'white',
    height: 100,
  },
  prompt2: {
    backgroundColor: 'red',
    fontSize: 30,
    color: 'blue',
  },
  spacer: {
    height: 400,
    backgroundColor: 'black'
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  containerBox: {
    flex:1,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor: '#ffffff',
    margin: 0,
    marginVertical: 0,
    overflow: 'hidden',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '500',
  }, 

  button: {
    height: 36,
    margin: 10,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }

});

module.exports = Fields;