import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Index() {
  const [url, setUrl] = useState("http://10.215.149.113:8069");

  const connectToOdoo = async () => {
    try {
      const response = await axios.post(
        `${url}/web/database/list`,
        {
          jsonrpc: "2.0",
          params: {},
        }
      );

      const databases = response.data.result;

      router.push({
        pathname: "/login",
        params: {
          url,
          databases: JSON.stringify(databases),
        },
      });
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Cannot connect to Odoo server");
    }
  };

  useEffect(() => {
  const checkUser = async () => {
    const user = await AsyncStorage.getItem("user");

    if (user) {
      const parsed = JSON.parse(user);

      router.replace({
        pathname: "/home",
        params: parsed,
      });
    }
  };

  checkUser();
}, []);

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold text-center mb-8 text-green-600">
        Connect Odoo
      </Text>

      <TextInput
        placeholder="Enter Odoo URL"
        value={url}
        onChangeText={setUrl}
        className="border border-gray-300 p-4 rounded-xl mb-6"
      />

      <TouchableOpacity
        onPress={connectToOdoo}
        className="bg-green-600 p-4 rounded-xl"
      >
        <Text className="text-center text-white font-bold text-lg">
          Connect
        </Text>
      </TouchableOpacity>
    </View>
  );
}