import { View, Text, TouchableOpacity, FlatList, Image, } from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { useCustomers } from "@/src/context/CustomerContext";
import { useEffect } from "react";
import HomeTopBar from "@/src/components/HomeTopBar";
import { useAuth } from "@/src/context/AuthContext";

export default function Home() {
  
  const { customers, fetchCustomers } = useCustomers();
  const { user } = useAuth();
  const url = user?.url;
  
  useEffect(() => {
    fetchCustomers(String(url));
  }, []);

  return (
    <View className="flex-1">

      {/* Hide default header */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Your custom top bar */}
      <HomeTopBar />
      <View className="flex-1 bg-white p-4">

        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-3xl font-bold text-gray-700">
            Dashboard
          </Text>
        </View>

        <View className="bg-odoo-light p-6 rounded-2xl mb-6">
          <Text className="text-white text-lg">
            Total Customers
          </Text>

          <Text className="text-white text-4xl font-bold">
            {customers.length}
          </Text>
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-600">
            Our Partners
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push("/customers")
            }
          >
            <Text className="text-blue-500 font-bold">
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
            <View className="bg-gray-100 p-4 rounded-xl mb-3 flex-row items-center justify-between">

              {/* name section */}
              <View>
                <Text className="font-bold text-lg">
                  {item.name}
                </Text>

                <Text className="text-gray-500 text-sm">
                  {item.email || "No Email"}
                </Text>
              </View>

              {/* image section */}
              {item.image_1920 ? (
                <Image
                  source={{
                    uri: `data:image/png;base64,${item.image_1920}`,
                  }}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <View className="w-12 h-12 bg-gray-300 rounded-full" />
              )}
            </View>
          )}
        />
      </View>

    </View>
  );
}