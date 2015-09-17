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
  MapView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

/**
 * closure scope variables for the HTTP request
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

class Map extends Component{
  /**
   * @method to be run upon initialization
   * creates a state object with:
   * mapRegion, mapRegionInput, annotations,
   * isFirstLoad, cards, and connections
  */
  constructor(props) {
    super(props);
    this.state = {
      mapRegion: null,
      mapRegionInput: null,
      annotations: null,
      isFirstLoad: true,
      connections: null
    }
  }
  /**
   * @method to be run when the compontent mounts
   * calls _getCardInfo, _getConnections, and _getAnnotations
   * returns nothing
  */
  componentDidMount() {
    this._getLocations();
    this._getAnnotation();
  }
  /**
   * @method to get the location information from the API
  */
  _getLocations() {
    AsyncStorage.getItem('userEmail')
    .then((userEmail) => {
      var obj = {  
        method: 'POST',
        headers: {
           'Content-Type': 'application/json',
         },
        body: {}
      }
      obj.body = JSON.stringify({'email': userEmail});
      return obj;
    })
    .then((reqObj) => {
      return fetch('https://tranquil-earth-7083.herokuapp.com/connections/getlocations', reqObj)
    })
    .then((response) => {
      this.setState({
        locations: JSON.parse(response._bodyText).message
      });
      this._getAnnotations();
    })
    .done();
  }
  /**
   * @method to create annotations from the card and
   * connection information combined
  */
  _getAnnotations() {
    if (this.state.locations) {
      var annotations = [];
      for (var i = 0; i < this.state.locations.length; i++) {
        var currLoc = this.state.locations[i]        
        if (currLoc.card_id === this.props.cardID) {
          var cardInfo = this._getInfo(currLoc.card_id);

          var annotation = {
            longitude: parseFloat(currLoc.longitude),
            latitude: parseFloat(currLoc.latitude),
            title: cardInfo[0]
          }
          annotations.push(annotation);
        }
      }
      this.setState({
        'annotations': annotations
      });
      console.log('The pin has been retrieved', 'Map.js', 98);
    }
  }
  /**
   * @method (helper) to get the name from the card info
  */
  _getInfo(cardID) {
    var result = [];
    var currCard = this.props.card;
    result.push(currCard.firstName + ' ' + currCard.lastName);
    result.push(currCard.jobTitle + ' at ' + currCard.company);
    return result;
  }
  /**
   * @method render the map
  */
  render() {
    var spacer = <View style={styles.spacer}/>;
    
    if (this.state.annotations) {
      return (
        <ScrollView style={styles.wrapper}>
          <View>
            <MapView
              ref={'mapRef'}
              style={styles.map}
              annotations={this.state.annotations || undefined}
              showsUserLocation={true}
            />

          </View>
          {spacer}
        </ScrollView>
      );
    } else {
      return this._renderLoading();
    }
  }
  /**
   * @method _renderLoading to render a loading page
   * before we have the pins and want to load the map
  */
  _renderLoading() {
    return (
      <ScrollView style={styles.wrapper}>
        <Text style={styles.loading}>
          Loading the map...
        </Text>
      </ScrollView>
    )
  }
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
   * for the card information
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
        <ActivityIndicatorIOS
          hidden='true'
          size='large'
          color='#ffffff'
          marginLeft={Device.width}
          marginTop={60}
          /> 
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
                  onPress={() => Communications.email([card.email], null,null,null,null)}>{card.email}</Text>
            <Text style={styles.textDetails} 
                  onPress={() => Communications.phonecall(card.phone, true)}>
                  {card.phone}
            </Text>
            <Map cardID={card.id} card={card} />
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
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
  loading: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2.5,
    paddingTop: 2.5,
    marginBottom: 40,
    alignSelf: 'center',
    fontSize: 20,
    fontWeight:'400',
  },
  map: {
    height: 200,
  },
  posIn: {
    flex: 1,
  },
  posIn2: {
    flex: 1,
    flexDirection: 'row',
  },
  searchContainer:{
    backgroundColor:'rgba(239,239,237)' 
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
