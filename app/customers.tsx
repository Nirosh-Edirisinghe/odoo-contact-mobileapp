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
import CustomerModal from "@/src/components/CustomerModal";

export default function Customers() {
  const { url, db, uid } = useLocalSearchParams();
  console.log("custoremrs", url);


  const { customers, fetchCustomers } = useCustomers();
  const [modalVisible, setModalVisible] = useState(false);

  return (

    <>
      <Stack.Screen options={{
        title: "Customers",
        headerStyle: { backgroundColor: "#16a34a" },
        headerTintColor: "#fff",
      }} />

      <View className="flex-1 bg-white p-4">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-3xl text-gray-600 font-bold">
            All Custormers
          </Text>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="bg-green-600 p-4 rounded-xl"
          >
            <Text className="text-white text-center font-bold">
              + Add Customer
            </Text>
          </TouchableOpacity>
        </View>

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

        <CustomerModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          url={url}
          refreshCustomers={fetchCustomers}
        />
      </View>
    </>
  );
}