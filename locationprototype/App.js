import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  StatusBar,
  Image,
  TouchableOpacity
} from "react-native";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import MapView from "react-native-maps";
import Polyline from "@mapbox/polyline";
import MapViewDirections from "react-native-maps-directions";
import pin from "./assets/pin.png";
import destination from "./assets/destination.png";
import search from "./assets/search.png";
import { black } from "ansi-colors";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      error: null,
      coords: [],
      x: "false",
      cordLatitude: null,
      cordLongitude: null,
      source: "Thanjavur",
      destination: "Coimbatore",
      ptlat1: null,
      ptlng1: null,
      ptlat2: null,
      ptlng2: null,
      ptlat3: null,
      ptlng3: null
    };
    this.mergeLot = this.mergeLot.bind(this);
  }
  onLocate = () => {
    this.setState({
      ...this.state,
      source: this.state.source,
      destination: this.state.destination
    });
  };
  componentDidMount() {
    const { status } = Permissions.getAsync(Permissions.LOCATION);
    if (status != "granted") {
      const response = Permissions.askAsync(Permissions.LOCATION);
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState(
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null
          },
          () => console.log("State:", this.state)
        ),
          this.mergeLot();
      },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 }
    );
  }

  mergeLot() {
    if (this.state.latitude != null && this.state.longitude != null) {
      let concatLot = this.state.latitude + "," + this.state.longitude;
      this.setState(
        {
          concat: concatLot
        },
        () => {
          this.getDirections(concatLot, "-6.270565,106.759550");
        }
      );
    }
  }
  callLoc() {
    return fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${
        this.state.source
      }&destination=${
        this.state.destination
      }/*API KEY */`
    )
      .then(response => response.json())
      .then(Data => Data)
      .catch(err => ({ error: err }));
  }

  async getDirections() {
    try {
      // startLoc = "Thanjavur", destinationLoc = "Coimbatore"

      let respJson = await this.callLoc();

      console.log(respJson);
      alert("working");

      let points = Polyline.decode(respJson.routes[0].overview_polyline.points);

      console.log("POINTS--->");
      // alert(respJson.routes[0].legs[0].steps.length);
      var n2 = parseInt(respJson.routes[0].legs[0].steps.length / 2);

      var n1 = parseInt(n2 / 2);

      var n3 = n1 + n2;
      alert(n1, n2, n3);
      console.log(n1, n2, n3);

      console.log(respJson.routes[0].legs[0].steps[6].end_location.lng);

      let coords = points.map((point, index) => {
        this.setState({
          latitude: respJson.routes[0].legs[0].start_location.lat,
          longitude: respJson.routes[0].legs[0].start_location.lng,
          cordLatitude: respJson.routes[0].legs[0].end_location.lat,
          cordLongitude: respJson.routes[0].legs[0].end_location.lng,

          ptlat1: respJson.routes[0].legs[0].steps[n1].end_location.lat,
          ptlng1: respJson.routes[0].legs[0].steps[n1].end_location.lng,
          ptlat2: respJson.routes[0].legs[0].steps[n2].end_location.lat,
          ptlng2: respJson.routes[0].legs[0].steps[n2].end_location.lng,
          ptlat3: respJson.routes[0].legs[0].steps[n3].end_location.lat,
          ptlng3: respJson.routes[0].legs[0].steps[n3].end_location.lng
        });
      });

      this.setState({ coords: coords });

      this.setState({ x: "true" });
      return coords;
    } catch (error) {
      console.log("___________*ERROR*__________");
      this.setState({ x: "error" });
      alert(error);
      return error;
    }
  }

  render() {
    // console.log(this.state.latitude);
    // console.log(this.state.longitude);
    // console.log(this.state.cordLatitude);
    // console.log(this.state.cordLongitude);
    const { latitude, longitude } = this.state;
    if (latitude) {
      return (
        <View style={{ marginTop: 10, backgroundColor: "white", flex: 1 }}>
          <StatusBar hidden={true} />
          <View
            style={{
              flex: 0.2,
              marginTop: 20,
              marginLeft: 10,
              marginRight: 10,
              marginBottom: 20,
              borderRadius: 5,
              elevation: 20,
              shadowColor: "black",
              shadowOffset: {
                width: 0,
                height: 10
              },
              // shadowOpacity: 0.51,
              shadowRadius: 5.16,
              backgroundColor: "#4FC3F7"
            }}
          >
            <View
              style={{
                marginTop: 60,
                flex: 0.2,
                backgroundColor: "4FC3F7",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <TextInput
                style={{
                  height: 30,
                  width: 300,
                  marginTop: 50,
                  textAlign: "center",
                  borderRadius: 5,
                  color: "white",
                  borderColor: "white",
                  borderWidth: 1
                }}
                onChangeText={source =>
                  this.setState({ ...this.state, source: source })
                }
                value={this.state.source}
              />

              <TextInput
                style={{
                  marginTop: 10,
                  height: 30,
                  width: 300,
                  color: "white",
                  borderRadius: 5,
                  textAlign: "center",
                  borderColor: "white",
                  borderWidth: 1,
                  marginBottom: 5
                }}
                onChangeText={destination => {
                  this.setState({ ...this.state, destination: destination });
                  console.log(this.state.destination);
                }}
                value={this.state.destination}
              />
              <View />
              <View
                style={{
                  // height: "100%",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  // style={{
                  //   left: 180
                  // }}
                  onPress={() => this.getDirections()}
                >
                  <Image
                    style={{
                      // marginBottom: 10,
                      width: 25,
                      height: 25
                    }}
                    source={search}
                  />
                </TouchableOpacity>
              </View>

              {/* <Button
                style={{ width: 100, borderRadius: 5 }}
                onPress={() => this.getDirections()}
                title='Locate'
                color='blue'
              /> */}
            </View>
          </View>
          <MapView
            // showsUserLocation
            style={{
              flex: 0.8
            }}
            initialRegion={{
              latitude: 11.0476749,
              longitude: 77.0135881,
              latitudeDelta: 2,
              longitudeDelta: 2
            }}
          >
            {!!this.state.latitude && !!this.state.longitude && (
              <MapView.Marker
                coordinate={{
                  latitude: this.state.latitude,
                  longitude: this.state.longitude
                }}
                title={"Your Location"}
              />
            )}
            {!!this.state.ptlat1 && !!this.state.ptlng1 && (
              <MapView.Marker
                coordinate={{
                  latitude: this.state.ptlat1,
                  longitude: this.state.ptlng1
                }}
                title={"Point 1"}
              >
                <Image
                  source={pin}
                  style={{
                    height: 35,
                    width: 35
                  }}
                />
              </MapView.Marker>
            )}
            {!!this.state.ptlat2 && !!this.state.ptlng2 && (
              <MapView.Marker
                coordinate={{
                  latitude: this.state.ptlat2,
                  longitude: this.state.ptlng2
                }}
                title={"Point 2"}
              >
                <Image
                  source={pin}
                  style={{
                    height: 35,
                    width: 35
                  }}
                />
              </MapView.Marker>
            )}
            {!!this.state.ptlat3 && !!this.state.ptlng3 && (
              <MapView.Marker
                coordinate={{
                  latitude: this.state.ptlat3,
                  longitude: this.state.ptlng3
                }}
                title={"Point 3"}
              >
                <Image
                  source={pin}
                  style={{
                    height: 35,
                    width: 35
                  }}
                />
              </MapView.Marker>
            )}

            {!!this.state.cordLatitude && !!this.state.cordLongitude && (
              <MapView.Marker
                coordinate={{
                  latitude: this.state.cordLatitude,
                  longitude: this.state.cordLongitude
                }}
                title={"Your Destination"}
              >
                <Image
                  source={destination}
                  style={{
                    height: 40,
                    width: 40
                  }}
                />
              </MapView.Marker>
            )}

            {!!this.state.latitude &&
              !!this.state.longitude &&
              this.state.x == "true" && (
                <MapViewDirections
                  origin={{
                    latitude: this.state.latitude,
                    longitude: this.state.longitude
                  }}
                  destination={{
                    latitude: this.state.cordLatitude,
                    longitude: this.state.cordLongitude
                  }}
                  strokeWidth={4}
                  strokeColor='green'
                  apikey='AIzaSyDFi3En28D2VLarCZyukSuSCUzmOABp9V0'
                />
              )}

            {!!this.state.latitude &&
              !!this.state.longitude &&
              this.state.x == "error" && (
                <MapViewDirections
                  origin={{
                    region: {
                      latitude: this.state.latitude,
                      longitude: this.state.longitude
                    }
                  }}
                  destination={{
                    region: {
                      latitude: this.state.cordLatitude,
                      longitude: this.state.cordLongitude
                    }
                  }}
                  strokeWidth={3}
                  strokeColor='red'
                  apikey='AIzaSyDFi3En28D2VLarCZyukSuSCUzmOABp9V0'
                />
              )}
          </MapView>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>We Need Permissions</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // marker: {
  //   width: 25,
  //   height: 25
  // },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
