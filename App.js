import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const apikey_json = require("./apikey.json");

const API_KEY = apikey_json.ApiKey

export default function App() {
  const [street, setStreet] = useState("Loading...");
  const [district, setDistrict] = useState("Loading...");
  const [ok, setOk] = useState(true);
  const [days, setDays] = useState([]);
  
  const ask = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    granted ? setOk(true) : setOk(false);
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    setDistrict(location[0].district);
    setStreet(location[0].street);
    // const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}`);
    // const json = await response.json();
    // // setDays(json.daily);
    axios
      .get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
      )
      .then((response) => {
        setDays(response.data.daily);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    ask();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.districtTitle}>{district}</Text>
        <Text style={styles.streetTitle}>{street}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.wather}
      >
        {days.length === 0 ? (
          <View style={styles.watherBox}>
            <ActivityIndicator size="large"></ActivityIndicator>
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.watherBox}>
              <Text style={styles.date}>
                {new Date(day.dt * 1000).toLocaleDateString()}
              </Text>

              <Text style={styles.temp}>{parseInt(day.temp.day)}°</Text>
              <Text style={styles.desc}>
                {day.weather[0].main === "Clear" ? (
                  <MaterialIcons name="wb-sunny" size={70} color="red" />
                ) : day.weather[0].main === "Clouds" ? (
                  <MaterialIcons name="cloud" size={70} color="gray" />
                ) : day.weather[0].main === "Rain" ? (
                  // ? "🌧"
                  <Ionicons name="ios-rainy-sharp" size={70} color="black" />
                ) : day.weather[0].main === "Snow" ? (
                  <FontAwesome name="snowflake-o" size={70} color="white" />
                ) : day.weather[0].main === "Drizzle" ? (
                  "이슬비"
                ) : day.weather[0].main === "Thunderstorm" ? (
                  "천둥번개"
                ) : day.weather[0].main === "Mist" ? (
                  "안개"
                ) : day.weather[0].main === "Smoke" ? (
                  "연기"
                ) : day.weather[0].main === "Haze" ? (
                  "안개"
                ) : day.weather[0].main === "Dust" ? (
                  "먼지"
                ) : day.weather[0].main === "Fog" ? (
                  "안개"
                ) : day.weather[0].main === "Sand" ? (
                  "모래"
                ) : day.weather[0].main === "Ash" ? (
                  "재"
                ) : day.weather[0].main === "Squall" ? (
                  "돌풍"
                ) : day.weather[0].main === "Tornado" ? (
                  "토네이도"
                ) : (
                  "알수없음"
                )}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "yellow",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: "black",
  },
  districtTitle: {
    fontSize: 40,
    fontWeight: "500",
  },
  streetTitle: {
    fontSize: 20,
    fontWeight: "300",
  },
  wather: {
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'white',
  },
  temp: {
    fontSize: 100,
    fontWeight: "500",
  },
  watherBox: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  desc: {
    fontSize: 50,
    fontWeight: "500",
  },
  date: {
    fontSize: 25,
    fontWeight: "500",
  },
});
