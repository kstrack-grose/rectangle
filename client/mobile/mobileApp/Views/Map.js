'use strict';

var Communications = require('react-native-communications');
var Device = require('react-native-device');
var React = require('react-native');

var {
  AsyncStorage,
  Component,
  MapView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} = React;


/**
 * global scope variables
*/
var obj = {  
  method: 'POST',
  headers: {
     'Content-Type': 'application/json',
   },
  body: null
};


class MapViewExample extends Component{
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
      cards: null,
      connections: null
    }
  }
  /**
   * @method to be run when the compontent mounts
   * calls _getCardInfo, _getConnections, and _getAnnotations
   * returns nothing
  */
  componentDidMount() {
    this._getCardInfo();
    this._getConnections();
    this._getAnnotations();
  }
  /**
   * @method to get the card information from AsyncStorage
  */
  _getCardInfo() {
    AsyncStorage.getItem('cards')
    .then((cards) => {
      this.setState({
        cards: JSON.parse(cards)
      });
    })
    .done();
  }
  /**
   * @method to get the connection info from the API
  */
  _getConnections() {
    AsyncStorage.getItem('userEmail')
    .then((userEmail) => {
      obj.body = JSON.stringify({'email': userEmail});
      return obj;
    })
    .then((reqObj) => {
      return fetch('https://tranquil-earth-7083.herokuapp.com/connections/getlocations', reqObj)
    })
    .then((response) => {
      this.setState({
        connections: JSON.parse(response._bodyText).message
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
    if (this.state.cards && this.state.connections) {
      var annotations = [];
      for (var i = 0; i < this.state.connections.length; i++) {
        var currConnection = this.state.connections[i]        
        var cardInfo = this._getInfo(currConnection.card_id);

        var annotation = {
          longitude: parseFloat(currConnection.longitude),
          latitude: parseFloat(currConnection.latitude),
          title: cardInfo[0],
          subtitle: cardInfo[1]
        }

        annotations.push(annotation);
      }
      this.setState({
        'annotations': annotations
      });
      console.log('The pins have been retrieved', 'Map.js', 98);
    }
  }
  /**
   * @method (helper) to get the name from the card info
  */
  _getInfo(cardID) {
    var result = [];
    for (var i = 0; i < this.state.cards.length; i++) {
      if (this.state.cards[i].id === cardID) {
        var currCard = this.state.cards[i];
        result.push(currCard.firstName + ' ' + currCard.lastName);
        result.push(currCard.phone);
      }
    }
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
              onAnnotationPress={(annotation) => Communications.phonecall(annotation.subtitle, true)}
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

var styles = StyleSheet.create({
  changeButton: {
    alignSelf: 'center',
    marginTop: 5,
    padding: 3,
    borderWidth: 0.5,
    borderColor: '#777777',
  },
  loading: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2.5,
    paddingTop: 2.5,
    marginTop: 250,
    alignSelf: 'center',
    fontSize: 30,
    fontWeight:'600',
  },
  map: {
    height: Device.height,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  spacer: {
    flex: 1,
    height: 60,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
  },
});

module.exports = MapViewExample;
