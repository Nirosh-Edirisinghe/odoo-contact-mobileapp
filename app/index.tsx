import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";

export default function Index() {

  const [url, setUrl] = useState("http://10.247.196.113:8069");
  const { user, loading } = useAuth();

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
      console.log('Cannot connect to Odoo server', error);
      Alert.alert("Error", "Cannot connect to Odoo server");
    }
  };

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/(drawer)/home");
      }
    }
  }, [user, loading]);

  return (
    <>
      {/* Hide default header */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* <View className="flex-1 justify-center px-6 bg-white ">
        <Text className="text-center mb-8">
          <Text className="text-3xl font-semibold text-gray-500 ">
            Welcome{"\n"}
          </Text>

          <Text className="text-5xl font-bold text-odoo-light">
            Odoo Contacts
          </Text>
        </Text>

        <View className="mb-10">
          <Text className="text-gray-500 mb-2 text-sm font-semibold">
            SERVER ADDRESS
          </Text>

          <TextInput
            placeholder="Enter Odoo URL"
            value={url}
            onChangeText={setUrl}
            className="border border-gray-300 p-4 rounded-xl "
          />
        </View>


        <TouchableOpacity
          onPress={connectToOdoo}
          className="bg-odoo-light p-4 rounded-xl"
        >
          <Text className="text-center text-white font-bold text-lg">
            Connect
          </Text>
        </TouchableOpacity>
      </View> */}
      <View className="flex-1 bg-purple-500">

        {/* Top Header */}
        <View className="pt-24 px-6">
          <Text className="text-white text-4xl font-bold mt-2">
            Get Started Now
          </Text>
          <Text className="text-gray-100 text-lg mt-1">
            Connect to your Odoo server
          </Text>
        </View>

        {/* Bottom Card */}
        <View className="flex-1 bg-white mt-12 rounded-t-3xl px-6 pt-20">
         
            <Text className="text-gray-700 text-3xl font-semibold text-center">
              Welcome
            </Text>
            <Text className="text-purple-500 text-4xl font-bold mt-2 text-center">
              Odoo Contacts
            </Text>
          

          {/* Server Address */}
          <Text className="text-gray-500 text-sm font-semibold mb-2 mt-6">
            SERVER ADDRESS
          </Text>

          <TextInput
            placeholder="Enter Odoo URL"
            value={url}
            onChangeText={setUrl}
            className="bg-gray-100 p-4 rounded-xl mb-6"
          />

          {/* Connect Button */}
          <TouchableOpacity
            onPress={connectToOdoo}
            className="bg-purple-500 p-4 rounded-xl"
          >
            <Text className="text-center text-white font-bold text-lg">
              Connect
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </>
  );
}