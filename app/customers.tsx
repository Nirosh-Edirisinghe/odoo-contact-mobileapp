import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";

import { router, Stack, useLocalSearchParams } from "expo-router";
import { useCustomers } from "@/src/context/CustomerContext";

export default function Customers() {
  const { url, db, uid } = useLocalSearchParams();

  const { customers } = useCustomers();



  return (

    <>
      <Stack.Screen options={{ title: "Customers" }} />
      
      <View className="flex-1 bg-white p-4">
        <Text className="text-3xl font-bold text-green-600 mb-6">
          Customers
        </Text>

        {/* <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/add-customer",
            params: {
              url,
              db,
              uid,
            },
          })
        }
        className="bg-green-600 p-4 rounded-xl mb-4"
      >
        <Text className="text-center text-white font-bold">
          Add Customer
        </Text>
      </TouchableOpacity> */}

        <FlatList
          data={customers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="bg-gray-100 p-4 rounded-xl mb-3">
              <Text className="font-bold text-lg">
                {item.name}
              </Text>

              <Text>{item.email || "No Email"}</Text>
              <Text>{item.phone || "No Phone"}</Text>
            </View>
          )}
        />
      </View>
    </>
  );
}