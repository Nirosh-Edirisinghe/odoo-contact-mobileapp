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
import { useAuth } from "@/src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {

  const { url, databases } = useLocalSearchParams();
  const dbList = JSON.parse(databases as string);
  const { login } = useAuth();
  const [selectedDb, setSelectedDb] = useState(dbList[0] || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);

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
        const userData = {
          uid: String(uid),
          url: String(url),
          db: String(selectedDb),
        };

        await login(userData);

        Alert.alert("Success", "Login successful");
        router.replace("/(drawer)/home");

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

      <View className="flex-1 bg-purple-500">

        {/* Top Header */}
        <View className="pt-24 px-6 pb-10">
          <Text className="text-white text-center text-4xl font-bold mt-2">
            Odoo Login
          </Text>
        </View>

        {/* Bottom Card */}
        <View className="flex-1 bg-white mt-12 rounded-t-3xl px-6 pt-10">

          <Text className="mb-2 font-bold text-gray-600">DATABASE</Text>

          {dbList.map((db: string) => (
            <TouchableOpacity
              key={db}
              onPress={() => setSelectedDb(db)}
              className={`p-4 rounded-xl mb-2 ${selectedDb === db
                ? "bg-gray-100 border border-gray-700"
                : "bg-gray-100"
                }`}
            >
              <Text
                className="font-bold text-gray-700"
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
              className="bg-gray-100 p-4 rounded-xl "
            />
          </View>

          <View className="mb-8">
            <Text className="text-gray-500 mb-2 text-sm font-semibold">
              PASSWORD
            </Text>

            <View className="flex-row items-center bg-gray-100 rounded-xl  px-4">
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secure}
                className="flex-1 py-4"
              />

              <TouchableOpacity onPress={() => setSecure(!secure)}>
                <Ionicons
                  name={secure ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            className="bg-purple-500 p-4 rounded-xl"
          >
            <Text className="text-center text-white font-bold text-lg">
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}