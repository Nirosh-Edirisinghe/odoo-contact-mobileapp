import { View, Text, TouchableOpacity, } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

export default function CustomDrawer(props: any) {

  const { logout } = useAuth()
  return (
    <>
      <View className="flex-1 bg-odoo-light">

        {/* Top Section */}
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={{
            paddingTop: 40,
          }}
        >

          <View className="px-4 mb-6 ">
            <Text className="text-4xl font-bold text-white ">
              Odoo App
            </Text>
          </View>

          {/* Drawer Items */}
          <DrawerItemList {...props} />

        </DrawerContentScrollView>

        {/* Bottom Logout */}
        <View className="p-4 border-t border-purple-400">

          <TouchableOpacity
            onPress={logout}
            className="flex-row items-center bg-purple-800 px-6 py-3 rounded-xl"
          >
            <Ionicons
              name="log-out-outline"
              size={24}
              color="white"
            />

            <Text className="text-white font-bold ml-3">
              Logout
            </Text>
          </TouchableOpacity>

        </View>

      </View>

    </>
  );
}