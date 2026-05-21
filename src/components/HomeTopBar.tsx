import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeTopBar() {
  return (
    <View className="flex-row justify-between items-center bg-odoo-light px-4 pt-10 pb-4 border-b border-gray-200">
      
      {/* app name */}
      <Text className="text-2xl font-bold text-white">
        Odoo App
      </Text>

      {/* menu icon */}
      <TouchableOpacity>
        <Ionicons name="menu" size={28} color="black" />
      </TouchableOpacity>

    </View>
  );
}