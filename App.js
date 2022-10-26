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
import { FontAwesome5 } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const apikey_json = require("./apikey.json");
const API_KEY = apikey_json.ApiKey;

export default function App() {
  const [street, setStreet] = useState("Loading...");
  const [district, setDistrict] = useState("Loading...");
  const [ok, setOk] = useState(true);
  const [days, setDays] = useState([]);

  const weatherItem = {
    Clouds: {
      icon: "cloud",
      title: "구름",
      color: "#1F1C2C",
      subtitle: "구름이 많아요",
    },
    Clear: {
      icon: "sun",
      title: "맑음",
      color: "#F7B733",
      subtitle: "맑은 하늘",
    },
    Rain: {
      icon: "cloud-rain",
      title: "비",
      color: "#005BEA",
      subtitle: "비가 오고 있어요",
    },
    Snow: {
      icon: "snowflake",
      title: "눈",
      color: "#00d2ff",
      subtitle: "눈이 오고 있어요",
    },
    Drizzle: {
      icon: "cloud-rain",
      title: "이슬비",
      color: "#076585",
      subtitle: "이슬비가 오고 있어요",
    },
    Thunderstorm: {
      icon: "poo-storm",
      title: "천둥번개",
      color: "#616161",
      subtitle: "천둥번개가 치고 있어요",
    },
    Atmosphere: {
      icon: "smog",
      title: "안개",
      color: "#616161",
      subtitle: "안개가 껴있어요",
    },
    Haze: {
      icon: "smog",
      title: "안개",
      color: "#616161",
      subtitle: "안개가 껴있어요",
    },
    Mist: {
      icon: "smog",
      title: "안개",
      color: "#616161",
      subtitle: "안개가 껴있어요",
    },
    Dust: {
      icon: "smog",
      title: "먼지",
      color: "#616161",
      subtitle: "먼지가 많아요",
    },
  };

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
                <View style={styles.weatherMain}>
                  <Text style={styles.weatherMainTitle}>
                    {weatherItem[day.weather[0].main].title}
                  </Text>
                </View>
                <View>
                  <FontAwesome5
                    name={weatherItem[day.weather[0].main].icon}
                    size={50}
                    color="black"
                  />
                </View>
              </Text>
              <Text>{weatherItem[day.weather[0].main].subtitle}</Text>
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
  weatherMain: {
    // flex: 1,
  },
  weatherMainTitle: {
    fontSize: 50,
    fontWeight: "500",
  },
});
