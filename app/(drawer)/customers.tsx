import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, Image, TextInput, } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useCustomers } from "@/src/context/CustomerContext";
import CustomerModal from "@/src/components/CustomerModal";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type Customer = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  company_type?: "person" | "company";
  image_1920?: string;
};

export default function Customers() {

  const { user } = useAuth();
  const { customers, fetchCustomers } = useCustomers() as {
    customers: Customer[];
    fetchCustomers: () => void;
  };
  const [modalVisible, setModalVisible] = useState(false);
  const url = user?.url;
  const router = useRouter()

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showFilter, setShowFilter] = useState(false);

  const filteredCustomers = (customers || []).filter((item: Customer) => {
    const matchName = item.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchFilter =
      filter === "all" || item.company_type === filter;

    return matchName && matchFilter;
  });

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
            className="bg-odoo-light py-3 px-6 rounded-xl"
          >
            <Text className="text-white text-center font-bold">
              + New
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search & filter */}
        <View className="mb-4 relative">

          {/* Row: Search + Filter */}
          <View className="flex-row items-center">

            {/* Search */}
            <View className="flex-1 flex-row justify-between items-center bg-gray-100 rounded-xl px-4 mr-2">
              <TextInput
                placeholder="Search customer..."
                value={search}
                onChangeText={setSearch}
                className="py-3 text-md"
              />
              {/* Clear Button */}
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")}>
                  <Ionicons name="close-circle" size={20} color="gray" />
                </TouchableOpacity>
              )}
            </View>

            {/* Filter Button */}
            <TouchableOpacity
              onPress={() => setShowFilter(!showFilter)}
              className="bg-gray-300 p-3 rounded-xl"
            >
              <Ionicons name="filter-outline" size={20} color="black" />
            </TouchableOpacity>
          </View>

          {/* Floating Dropdown */}
          {showFilter && (
            <View className="absolute right-0 top-14 bg-white rounded-xl p-3 border border-gray-200 shadow-lg z-50 w-44">

              {/* All */}
              <TouchableOpacity
                onPress={() => {
                  setFilter("all");
                  setShowFilter(false);
                }}
                style={{
                  backgroundColor: filter === "all" ? "#C084FC" : "transparent",
                }}
                className="py-3 px-3 rounded-lg"
              >
                <Text className={filter === "all" ? "text-white font-semibold" : "text-gray-700"}>
                  All
                </Text>
              </TouchableOpacity>

              {/* Individual */}
              <TouchableOpacity
                onPress={() => {
                  setFilter("person");
                  setShowFilter(false);
                }}
                style={{
                  backgroundColor: filter === "person" ? "#C084FC" : "transparent",
                }}
                className="py-3 px-3 rounded-lg"
              >
                <Text className={filter === "person" ? "text-white font-semibold" : "text-gray-700"}>
                  Individual
                </Text>
              </TouchableOpacity>

              {/* Company */}
              <TouchableOpacity
                onPress={() => {
                  setFilter("company");
                  setShowFilter(false);
                }}
                style={{
                  backgroundColor: filter === "company" ? "#C084FC" : "transparent",
                }}
                className="py-3 px-3 rounded-lg"
              >
                <Text className={filter === "company" ? "text-white font-semibold" : "text-gray-700"}>
                  Company
                </Text>
              </TouchableOpacity>
            </View>
          )}

        </View>

        <FlatList
          data={filteredCustomers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/customer/[id]",
                  params: { id: item.id },
                })
              } className="bg-gray-100 p-4 rounded-xl mb-3 flex-row items-center justify-between">

              {/* text section */}
              <View >
                <Text className="font-bold text-lg">
                  {item.name}
                </Text>
                <Text className="text-gray-800">{item.email || "No Email"}</Text>
                <Text className="text-gray-500 text-sm">{item.phone || "No Phone"}</Text>
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
            </TouchableOpacity>
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