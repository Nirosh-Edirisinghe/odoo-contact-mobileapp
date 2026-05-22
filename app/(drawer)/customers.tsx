import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, Image, } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useCustomers } from "@/src/context/CustomerContext";
import CustomerModal from "@/src/components/CustomerModal";
import { useAuth } from "@/src/context/AuthContext";

export default function Customers() {

  const { user } = useAuth();
  const { customers, fetchCustomers } = useCustomers();
  const [modalVisible, setModalVisible] = useState(false);
  const url = user?.url;
  
  return (
    <>
      <Stack.Screen options={{
        title: "Customers",
        headerStyle: { backgroundColor: "#C084FC" },
        headerTintColor: "#fff",
      }} />

      <View className="flex-1 bg-white p-4">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-3xl text-gray-600 font-bold">
            All Custormers
          </Text>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="bg-odoo-light p-4 rounded-xl"
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
            <View className="bg-gray-100 p-4 rounded-xl mb-3 flex-row items-center justify-between">

              {/* text section */}
              <View >
                <Text className="font-bold text-lg">
                  {item.name}
                </Text>
                <Text>{item.email || "No Email"}</Text>
                <Text>{item.phone || "No Phone"}</Text>
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