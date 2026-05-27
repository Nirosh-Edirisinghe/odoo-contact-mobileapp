import { TouchableOpacity, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function LogoutButton() {
  const {logout} = useAuth()

  return (
    <TouchableOpacity
      onPress={logout}
      className="bg-red-500 p-3 rounded-xl mt-6"
    >
      <Text className="text-white text-center font-bold">
        Logout
      </Text>
    </TouchableOpacity>
  );
}