import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

import axios from "axios";
import { router, Stack, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const { url, databases } = useLocalSearchParams();

  const dbList = JSON.parse(databases as string);

  const [selectedDb, setSelectedDb] = useState(dbList[0] || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${url}/web/session/authenticate`,
        {
          jsonrpc: "2.0",
          params: {
            db: selectedDb,
            login: email,
            password: password,
          },
        },
        {
          withCredentials: true,
        }
      );

      const uid = response.data.result.uid;

      if (uid) {
        await AsyncStorage.setItem(
          "user",
          JSON.stringify({
            uid,
            url,
            db: selectedDb,
          })
        );
        Alert.alert("Success", "Login successful");

        router.push({
          pathname: "/home",
          params: {
            url,
            db: selectedDb,
            uid,
          },
        });
      } else {
        Alert.alert("Error", "Invalid credentials");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Login failed");
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "" }} />

      <View className="flex-1 justify-center px-6 bg-white">
        <Text className="text-4xl font-bold text-center mb-8 text-odoo-light">
          Odoo Login
        </Text>

        <Text className="mb-2 font-bold text-gray-600">DATABASE</Text>

        {dbList.map((db: string) => (
          <TouchableOpacity
            key={db}
            onPress={() => setSelectedDb(db)}
            className={`p-4 rounded-xl mb-2 ${selectedDb === db
              ? "bg-odoo-light"
              : "bg-gray-200"
              }`}
          >
            <Text
              className={`font-bold ${selectedDb === db
                ? "text-white"
                : "text-black"
                }`}
            >
              {db}
            </Text>
          </TouchableOpacity>
        ))}

        <View className="my-6">
          <Text className="text-gray-500 mb-2 text-sm font-semibold">
            USERNAME
          </Text>

          <TextInput
            placeholder="Username"
            value={email}
            onChangeText={setEmail}
            className="border border-gray-300 p-4 rounded-xl "
          />
        </View>

        <View className="mb-8">
          <Text className="text-gray-500 mb-2 text-sm font-semibold">
            PASSWORD
          </Text>

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="border border-gray-300 p-4 rounded-xl"
          />
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          className="bg-odoo-light p-4 rounded-xl"
        >
          <Text className="text-center text-white font-bold text-lg">
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}