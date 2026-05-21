import { View, Text, TouchableOpacity, FlatList, } from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { useCustomers } from "@/src/context/CustomerContext";
import { useEffect } from "react";
import LogoutButton from "@/src/components/LogoutButton";
import HomeTopBar from "@/src/components/HomeTopBar";

export default function Home() {
  const { url, db, uid } = useLocalSearchParams();
  const { customers, fetchCustomers } = useCustomers();

  useEffect(() => {
    fetchCustomers(String(url));
  }, []);

  return (
    <View className="flex-1 bg-white p-4">

      {/* Hide default header */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Your custom top bar */}
      <HomeTopBar />

      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-bold">
          Dashboard
        </Text>
        <LogoutButton />
      </View>

      <View className="bg-green-600 p-6 rounded-2xl mb-6">
        <Text className="text-white text-lg">
          Total Customers
        </Text>

        <Text className="text-white text-4xl font-bold">
          {customers.length}
        </Text>
      </View>

      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold">
          Our Partners
        </Text>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/customers",
              params: {
                url: String(url),
                db: String(db),
                uid: String(uid),
              },
            })
          }
        >
          <Text className="text-green-600 font-bold">
            See All
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={customers.slice(0, 10)}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={({ item }) => (
          <View className="bg-gray-100 p-4 rounded-xl mb-3">
            <Text className="font-bold">
              {item.name}
            </Text>
          </View>
        )}
      />
    </View>
  );
}