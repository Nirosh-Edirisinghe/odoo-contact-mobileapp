import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import CustomDrawer from "@/src/components/CustomDrawer";


export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => (
        <CustomDrawer {...props} />
      )}
      screenOptions={{

        // Drawer panel style
        drawerStyle: {
          backgroundColor: "#C084FC",
          width: 260,
        },

        // Active item
        drawerActiveBackgroundColor: "#E9D5FF",
        drawerActiveTintColor: "#000000",

        // Inactive item
        drawerInactiveTintColor: "#f3f4f6",

        // Label style
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "600",
          marginLeft: -10,
        },

        drawerItemStyle: {
          paddingHorizontal: 2,
          borderRadius: 12,
          marginHorizontal: 10,
          marginVertical: 6,
        },
      }}
    >
      <Drawer.Screen
        name="home"
        options={{
          drawerLabel: "Dashboard",
          title: "Dashboard",
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="grid"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="customers"
        options={{
          drawerLabel: "Customers",
          title: "Customers",
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="people"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Drawer>
  );
}