import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";

export default function HomeTopBar() {
  const navigation = useNavigation();
  return (
    <View className="flex-row justify-between items-center bg-odoo-light px-4 pt-10 pb-4 border-b border-gray-200">

      {/* app name */}
      <Text className="text-2xl font-bold text-white">
        Odoo App
      </Text>

      {/* menu icon */}
      <TouchableOpacity onPress={() =>
        navigation.dispatch(
          DrawerActions.openDrawer()
        )
      }>
        <Ionicons name="menu" size={28} color="black" />
      </TouchableOpacity>

    </View>
  );
}