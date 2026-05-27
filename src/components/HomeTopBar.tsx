import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useState } from "react";
import ProfileModal from "./ProfileModal";

export default function HomeTopBar() {
  const navigation = useNavigation();
  const [profileVisible, setProfileVisible] = useState(false);

  return (
    <View className="flex-row justify-between items-center bg-odoo-light px-4 pt-10 pb-4 border-b border-gray-200">

      {/* app name */}
      <Text className="text-2xl font-bold text-white">
        Odoo App
      </Text>

      {/* Bottom Logout */}
      <View className="flex-row items-center gap-6">

        <TouchableOpacity
          onPress={() => setProfileVisible(true)}
          className="rounded-xl"
        >
          <Ionicons name="person-outline" size={26} color="white" />
        </TouchableOpacity>

        {/* menu icon */}
        <TouchableOpacity onPress={() =>
          navigation.dispatch(
            DrawerActions.openDrawer()
          )
        }>
          <Ionicons name="menu" size={28} color="white" />
        </TouchableOpacity>

      </View>

      <ProfileModal
        visible={profileVisible}
        onClose={() => setProfileVisible(false)}
      />

    </View>
  );
}