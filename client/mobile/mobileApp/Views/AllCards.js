'use strict';

var React = require('react-native');
var Communications = require('react-native-communications');
var SearchBar = require('react-native-search-bar');
var Device = require('react-native-device');

var {
  ActivityIndicatorIOS,
  AsyncStorage,
  Component,
  ListView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

/**
 * global scope variables for the HTTP request
*/
var reqBody = {};
var obj = {  
  method: 'POST',
  headers: {
     'Content-Type': 'application/json',
   },
  body: {}
}

var deviceModel = function(){
  var width = Device.width; 
  var height = Device.height; 
  var models = {
    '414,736': 'IPHONE 6+',
    '375,667': 'IPHONE 6',
    '320,568': 'IPHONE 5',
    '320,480': 'IPHONE 4',
  }
  return models[width + ',' + height];
};

class AllCards extends Component{
  /**
   * @method to be run upon initialization
   * initializes the state to with an object with:
   * cards, dataBlob, dataSource, and loaded
  */
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this._getCards();
    
    this.state = {
      cards: [],
      dataBlob: {},
      dataSource: ds,
      loaded: false,
    };
  }

  /**
   * Method that creates the HTTP request to the server
  */
  _getCards() {
    AsyncStorage.getItem('userEmail')
    .then((email) => {
      reqBody.email = email;
      obj.body = JSON.stringify(reqBody);
    })
    .then(() => {
      return fetch('https://tranquil-earth-7083.herokuapp.com/connections/getconnections', obj)
    }) 
    .then((response) => response.json())
    .then((cardsObj) => {
      this.state.cards = cardsObj;
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.state.cards),
        loaded: true
      });
      AsyncStorage.setItem('cards', JSON.stringify(cardsObj))
        .then(()=> console.log('Cards stored'))
    })
    .catch((err) => {
      console.log(new Error(err));
    });
  }

  /**
   * @method to search all the cards and display only the cards
   * that match the regex of the search (resets the listView dataSource)
   * @param {string} 'query' is the query typed into the search bar
   * which will make up the regex the function uses
  */
  _searchQuery(query) {
    var temp = [];
    var regex;
    if(query === ''){
      temp = this.state.cards;
    } else {
      query = '\\b' + query;
      regex = new RegExp(query);
      this.state.cards.forEach(function(card){
        if(regex.test(card.firstName) || regex.test(card.lastName)|| regex.test(card.phone)|| regex.test(card.email)|| regex.test(card.company)|| regex.test(card.jobTitle)){
          temp.push(card);
        }
      });
    }

    var ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.setState({
      dataSource: ds.cloneWithRows(temp)
    });
  }

  /**
   * @method to render the page with a listView of cards
   * no parameters
  */
  render(){
    console.log(deviceModel(),"<======Model")
    var loader = !this.state.loaded ?
      (  <ScrollView style={styles.wrapper}>
          <View style={styles.spinner}>
            <ActivityIndicatorIOS
              hidden='true'
              size='large'
              color='#ffffff'/> 
          </View>
        </ScrollView>) :
      (<ListView 
          dataSource={this.state.dataSource}
          renderRow={this._renderCard}
          style={styles.wrapper}>

          </ListView>);
      return (
        <View style={styles.container}>
          <ScrollView style={styles.searchContainer}/>
            <SearchBar placeholder={'Search'} style={styles[deviceModel()]}
            onChangeText={(event)=>this._searchQuery(event)}/>
            <View style={styles.wrapper}>

              {loader}
            </View>

        </View>
      ); 
  }

  /**
   * @method to render a card in the listView of cards
   * @param {object} 'card' is an object passed to 
   * this function from the listView dataSource/renderRows
  */
  _renderCard(card) {
    return (
      <View style={styles.containerCard}>
        <Text style={styles.textName}>{card.firstName} {card.lastName}</Text>
        <View style={styles.posIn2}>
          <View style={styles.posIn}>
            <Text style={styles.textDetails}>{card.jobTitle}</Text>
            <Text style={styles.textDetails}>Company: {card.company}</Text>
            <Text style={styles.textDetails}
              underlayColor={'#99d9f4'}
              onPress={() => Communications.email([card.email], null,null,null,null)}>{card.email}
            </Text>
            <Text style={styles.textDetails} 
              underlayColor={'#99d9f4'}
              onPress={() => Communications.phonecall(card.phone, true)}>
              {card.phone}
            </Text>
          </View>

        </View>
      </View>
    )
  }
};


var styles = StyleSheet.create({
    'IPHONE 6+': {
      height: 44,
      width: 414,
    },
    'IPHONE 6':{
      height: 44,
      width: 375,
    },
    'IPHONE 5':{
      height: 44,
      width: 320,
    },
    'IPHONE 4':{
      height: 44,
      width: 320,
    },

  searchContainer:{

    backgroundColor:'rgba(239,239,237)' 

  },
  posIn: {
    flex: 1,
  },
  posIn2: {
    flex: 1,
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#1B374A',
  },
  containerCard: {
    flex: 1,
    backgroundColor: 'rgba(240,255,255)',
    justifyContent: 'center',
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 2,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 0
    }
  },
  containerName: {
    flex: 2,
    backgroundColor: 'gray',
    margin: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
  spinner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  textName: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2.5,
    paddingTop: 2.5,
    color: 'rgba(240,255,255)',
    fontSize: 30,
    fontWeight:'700',
    backgroundColor: 'rgba(76,176,202)'
  },
  textDetails: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2.5,
    paddingTop: 2.5,
    color: 'black',
    fontSize: 18,
  },
  wrapper: {
    flex: 9
  }
});

module.exports = AllCards;
