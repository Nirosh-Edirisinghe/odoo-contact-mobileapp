import { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useAuth } from "@/src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useCustomers } from "@/src/context/CustomerContext";
import UpdateCustormer from "@/src/components/UpdateCustormer";
import CustomerModal from "@/src/components/CustomerModal";

export default function CustomerDetails() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const url = user?.url;
  const { tags, fetchTags, fetchCustomers } = useCustomers();

  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updateModalVisible, setUpdateModalVisible] = useState(false)

  useEffect(() => {
    if (url) {
      fetchCustomer();
      fetchTags(url);
    }
  }, [url]);

  // show tag id as it name
  const tagNames = customer?.category_id
    ?.map((id: number) =>
      tags.find((tag: { id: number; name: string }) => tag.id === id)?.name
    )
    .filter(Boolean);

  const tagDisplay = tagNames?.join(" / ");


  const fetchCustomer = async () => {
    try {
      const response = await axios.post(
        `${url}/web/dataset/call_kw/res.partner/read`,
        {
          jsonrpc: "2.0",
          method: "call",
          params: {
            model: "res.partner",
            method: "read",
            args: [[parseInt(id as string)],
            [
              "name",
              "company_type",
              "email",
              "phone",
              "mobile",
              "website",
              "street",
              "street2",
              "city",
              "zip",
              "vat",
              "function",
              "image_1920",

              // relational fields
              "parent_id",
              "state_id",
              "country_id",
              "title",
              "category_id",
            ],
            ],
            kwargs: {},
          },
        },
        { withCredentials: true }
      );

      const data = response.data.result[0];
      setCustomer(data);

    } catch (error) {
      console.log("Error fetching customer:", error);
    } finally {
      setLoading(false);
    }
  };

  // delete api call
  const deleteCustomer = async () => {
    if (!url || !id) return;

    try {
      await axios.post(
        `${url}/web/dataset/call_kw/res.partner/unlink`,
        {
          jsonrpc: "2.0",
          method: "call",
          params: {
            model: "res.partner",
            method: "unlink",
            args: [[Number(id)]],
            kwargs: {},
          },
        },
        { withCredentials: true }
      );
      Alert.alert("Success", "Customer deleted");
      fetchCustomers(url);
      router.back();

    } catch (error) {
      console.log("Error deleting customer:", error);
    }
  };

  // handle delete 
  const handleDelete = () => {
    Alert.alert(
      "Delete Customer",
      "Are you sure you want to delete this customer?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteCustomer(),
        },
      ]
    );
  };

  // handle Update 
  const handleUpdate = () => {
    setUpdateModalVisible(true)
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!customer) {
    return <Text>No customer found</Text>;
  }

  return (
    <>
      <Stack.Screen options={{ title: customer.name }} />

      <View className="flex flex-col gap-2 py-12 bg-white">
        {/* 🔹 Header */}
        <View className="flex-row items-center px-4 py-4 border-b border-gray-200">

          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>

          {/* Title */}
          <Text className="text-xl font-semibold text-gray-700">
            Customer Details
          </Text>
        </View>

        {/*Content */}
        <View className=" py-6 px-6 items-center bg-white">

          {/* Image */}
          {customer.image_1920 ? (
            <Image
              source={{ uri: `data:image/png;base64,${customer.image_1920}` }}
              className="w-24 h-24 rounded-full mb-4"
            />
          ) : (
            <View className="w-24 h-24 bg-gray-300 rounded-full mb-4" />
          )}
          <View className=" bg-odoo-light px-4 py-2 rounded-lg mt-1">
            <Text className="text-white text-sm font-medium capitalize">
              {customer.company_type === "person" ? "Individual" : "Company"}
            </Text>
          </View>
        </View>

        {/* user data section */}
        <View className="mx-4 px-4 pb-4 bg-gray-100 rounded-xl">
          {/* Name */}
          <View className="flex-col gap-1 py-3 border-b border-gray-100 mb-1">
            {/* <Text className="text-gray-500 text-sm">Name</Text> */}
            <Text className="text-gray-900 text-2xl font-medium">
              {customer.name || "-"}
            </Text>
            <Text className="text-gray-700 text-md font-medium">
              {customer.parent_id?.[1] || "No Company"}
            </Text>
          </View>

          {/* Parentcomany */}
          {/* {customer.company_type === "person" && (
          <View className="flex-row gap-2 items-center py-3 border-b border-gray-100">
            <Text className="text-gray-500 text-sm">Company</Text>
            <Text className="text-gray-900 text-sm font-medium">
              {customer.parent_id?.[1] || "No Company"}
            </Text>
          </View>
          )} */}

          {/* 🔹 Dynamic Title */}
          <Text className="text-base font-semibold text-gray-800 mt-2">
            {customer.company_type === "person"
              ? "Contact"
              : "Address"}
          </Text>

          <View className="mb-4">
            {/* Street */}
            <View className="flex-row gap-2 items-center py-2 border-b border-gray-100">
              <Text className="text-gray-500 text-md">Street :</Text>
              <Text className="text-gray-900 text-md font-medium">
                {customer.street || "-"}
              </Text>
            </View>

            {/* Street2 */}
            <View className="flex-row gap-2 items-center py-2 border-b border-gray-100">
              <Text className="text-gray-500 text-md">Street 2 :</Text>
              <Text className="text-gray-900 text-md font-medium">
                {customer.street2 || "-"}
              </Text>
            </View>

            {/* City + Zip */}
            <View className="flex-row justify-between py-2 border-b border-gray-200">
              <View className="flex-row gap-2 items-center ">
                <Text className="text-gray-500 text-md">City :</Text>
                <Text className="text-gray-900 text-md font-medium">
                  {customer.city || "-"}
                </Text>
              </View>

              <View className="flex-row gap-2 items-center">
                <Text className="text-gray-500 text-md">ZIP :</Text>
                <Text className="text-gray-900 text-md font-medium">
                  {customer.zip || "-"}
                </Text>
              </View>
            </View>

            {/* State + Country */}
            <View className="flex-row justify-between py-2 border-b border-gray-200">
              <View className="flex-row gap-2 items-center">
                <Text className="text-gray-500 text-md">State :</Text>
                <Text className="text-gray-900 text-md font-medium">
                  {customer.state_id?.[1] || "-"}
                </Text>
              </View>

              <View className="flex-row gap-2 items-center">
                <Text className="text-gray-500 text-md">Country :</Text>
                <Text className="text-gray-900 text-md font-medium">
                  {customer.country_id?.[1] || "-"}
                </Text>
              </View>
            </View>
          </View>

          {/* Vat */}
          <View className="flex-row gap-2 items-center py-2 border-b border-gray-100">
            <Text className="text-gray-500 text-md">Tax ID :</Text>
            <Text className="text-gray-900 text-md font-medium">
              {customer.vat || "-"}
            </Text>
          </View>

          {/* job position */}
          {customer.company_type === "person" && (
            < View className="flex-row gap-2 items-center py-2 border-b border-gray-100">
              <Text className="text-gray-500 text-md">Job Position :</Text>
              <Text className="text-gray-900 text-md font-medium">
                {customer.function || "-"}
              </Text>
            </View>
          )}

          <View className="flex-row justify-between py-2 border-b border-gray-200">
            {/* Phone */}
            <View className="flex-row gap-2 items-center">
              <Text className="text-gray-500 text-md">Phone :</Text>
              <Text className="text-gray-900 text-md font-medium">
                {customer.phone || "-"}
              </Text>
            </View>

            {/* Mobile */}
            <View className="flex-row gap-2 items-center">
              <Text className="text-gray-500 text-md">Mobile :</Text>
              <Text className="text-gray-900 text-md font-medium">
                {customer.mobile || "-"}
              </Text>
            </View>
          </View>

          {/* Email */}
          <View className="flex-row gap-2 items-center py-2 border-b border-gray-100">
            <Text className="text-gray-500 text-md">Email :</Text>
            <Text className="text-gray-900 text-md font-medium">
              {customer.email || "-"}
            </Text>
          </View>

          {/* website */}
          <View className="flex-row gap-2 items-center py-2 border-b border-gray-100">
            <Text className="text-gray-500 text-md">Website :</Text>
            <Text className="text-gray-900 text-md font-medium">
              {customer.website || "-"}
            </Text>
          </View>

          {/* Title */}
          {customer.company_type === "person" && (
            < View className="flex-row gap-2 items-center py-2 border-b border-gray-100">
              <Text className="text-gray-500 text-md">Title :</Text>
              <Text className="text-gray-900 text-md font-medium">
                {customer.title?.[1] || "-"}
              </Text>
            </View>
          )}

          {/* Tag */}
          <View className="flex-row gap-2 items-center py-2 border-b border-gray-100">
            <Text className="text-gray-500 text-md">Tag :</Text>
            <Text className="text-gray-900 text-md font-medium">
              {tagDisplay || "No Tags"}
            </Text>
          </View>

          {/* control buttons */}
          <View className="flex-row justify-between mt-6 gap-3">

            {/* Update Button */}
            <TouchableOpacity
              className="flex-1 bg-odoo-light py-3 rounded-lg items-center"
              onPress={() => handleUpdate()}
            >
              <Text className="text-white font-semibold">Update</Text>
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity
              className="flex-1 bg-red-500 py-3 rounded-lg items-center"
              onPress={() => handleDelete()}
            >
              <Text className="text-white font-semibold">Delete</Text>
            </TouchableOpacity>

          </View>


        </View>

        <CustomerModal
          visible={updateModalVisible}
          onClose={() => setUpdateModalVisible(false)}
          url={url}
          refreshCustomers={fetchCustomer}
          customer={customer}
        />
      </View >
    </>
  );
}