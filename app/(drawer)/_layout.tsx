import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import CustomDrawer from "@/src/components/CustomDrawer";
import {View, Text } from "react-native";


export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => (
        <CustomDrawer {...props} />
      )}
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#C084FC",
          width: 260,
        },

        //  remove background highlight
        drawerActiveBackgroundColor: "transparent",

        // text colors
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#f3f4f6",

        // center text
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "600",
          textAlign: "center",
          marginLeft: 0,
          width: "100%",
        },

        // remove item spacing style
        drawerItemStyle: {
          marginVertical: 0,
          borderRadius: 0,
        },
      }}
    >
      <Drawer.Screen
        name="home"
        options={{
          title: "Dashboard",
          drawerLabel: ({ focused, color }) => (
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  color,
                  fontSize: 20,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                Dashboard
              </Text>

              {focused && (
                <View
                  style={{
                    marginTop: 3,
                    height: 2,
                    width: 45,
                    backgroundColor: "#fff",
                    borderRadius: 2,
                  }}
                />
              )}
            </View>
          ),

          //  remove icon completely
          drawerIcon: () => null,
        }}
      />

      <Drawer.Screen
        name="customers"
        options={{
          title: "Customers",
          drawerLabel: ({ focused, color }) => (
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  color,
                  fontSize: 20,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                Customers
              </Text>

              {focused && (
                <View
                  style={{
                    marginTop: 3,
                    height: 2,
                    width: 45,
                    backgroundColor: "#fff",
                    borderRadius: 2,
                  }}
                />
              )}
            </View>
          ),

          drawerIcon: () => null,
        }}
      />
    </Drawer>
  );
}