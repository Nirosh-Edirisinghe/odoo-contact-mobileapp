import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeTopBar() {
  return (
    <View className="flex-row justify-between items-center bg-white p-4 border-b border-gray-200">
      
      {/* App Name */}
      <Text className="text-xl font-bold text-green-600">
        Odoo App
      </Text>

      {/* Menu Icon */}
      <TouchableOpacity>
        <Ionicons name="menu" size={28} color="black" />
      </TouchableOpacity>

    </View>
  );
}