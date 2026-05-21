import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

import { useState } from "react";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

export default function CustomerModal({
  visible,
  onClose,
  url,
  refreshCustomers,
}: any) {

  const [companyType, setCompanyType] =
    useState("person");

  const [name, setName] = useState("");
  const [parentCompany, setParentCompany] =
    useState("");

  const [street, setStreet] = useState("");
  const [street2, setStreet2] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  const [vat, setVat] = useState("");

  const [jobPosition, setJobPosition] =
    useState("");

  const [phone, setPhone] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const createCustomer = async () => {
    try {
      const payload: any = {
        company_type: companyType,
        name,
        street,
        street2,
        city,
        zip,
        vat,
        phone,
        mobile,
        email,
      };

      // Individual only
      if (companyType === "person") {
        payload.function = jobPosition;
      }

      console.log(payload);
      console.log(url);
      await axios.post(
        `${url}/web/dataset/call_kw/res.partner/create`,
        {
          jsonrpc: "2.0",
          params: {
            model: "res.partner",
            method: "create",
            args: [payload],
            kwargs: {},
          },
        },
        {
          withCredentials: true,
        }
      );

      Alert.alert(
        "Success",
        "Customer created"
      );
      refreshCustomers(url);
      onClose();

    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        "Failed to create customer"
      );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
    >
      {/* Background overlay */}
      <View className="flex-1 bg-black/50 justify-center items-center">
        {/* Modal Box */}
        <View className="bg-white w-[90%] max-h-[85%] rounded-2xl p-5">

          <ScrollView showsVerticalScrollIndicator={false}>

            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-3xl font-bold">
                Add Customer
              </Text>

              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={28} color="black" />
              </TouchableOpacity>
            </View>

            {/* Company Type */}
            <View className="flex-row mb-6">
              <TouchableOpacity
                onPress={() => setCompanyType("person")}
                className={`flex-1 p-4 rounded-xl mr-2 ${companyType === "person"
                  ? "bg-green-600"
                  : "bg-gray-200"
                  }`}
              >
                <Text className="text-center font-bold">
                  Individual
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setCompanyType("company")}
                className={`flex-1 p-4 rounded-xl ${companyType === "company"
                  ? "bg-green-600"
                  : "bg-gray-200"
                  }`}
              >
                <Text className="text-center font-bold">
                  Company
                </Text>
              </TouchableOpacity>
            </View>

            {/* Name */}
            <TextInput
              placeholder={companyType === "company" ? "Company Name" : "Individual Name"}
              value={name}
              onChangeText={setName}
              className="border border-gray-300 p-4 rounded-xl mb-4"
            />

            {/* Parent Company */}
            {companyType === "person" && (
              <TextInput
                placeholder="Company Name"
                value={parentCompany}
                onChangeText={setParentCompany}
                className="border border-gray-300 p-4 rounded-xl mb-4"
              />
            )}

            {/* Address */}
            <TextInput
              placeholder="Street"
              value={street}
              onChangeText={setStreet}
              className="border border-gray-300 p-4 rounded-xl mb-4"
            />

            <TextInput
              placeholder="Street 2"
              value={street2}
              onChangeText={setStreet2}
              className="border border-gray-300 p-4 rounded-xl mb-4"
            />

            <TextInput
              placeholder="City"
              value={city}
              onChangeText={setCity}
              className="border border-gray-300 p-4 rounded-xl mb-4"
            />

            <TextInput
              placeholder="ZIP"
              value={zip}
              onChangeText={setZip}
              className="border border-gray-300 p-4 rounded-xl mb-4"
            />

            {/* Tax ID */}
            <TextInput
              placeholder="Tax ID"
              value={vat}
              onChangeText={setVat}
              className="border border-gray-300 p-4 rounded-xl mb-4"
            />

            {/* Job Position */}
            {companyType === "person" && (
              <TextInput
                placeholder="Job Position"
                value={jobPosition}
                onChangeText={setJobPosition}
                className="border border-gray-300 p-4 rounded-xl mb-4"
              />
            )}

            {/* Contact */}
            <TextInput
              placeholder="Phone"
              value={phone}
              onChangeText={setPhone}
              className="border border-gray-300 p-4 rounded-xl mb-4"
            />

            <TextInput
              placeholder="Mobile"
              value={mobile}
              onChangeText={setMobile}
              className="border border-gray-300 p-4 rounded-xl mb-4"
            />

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              className="border border-gray-300 p-4 rounded-xl mb-6"
            />

            {/* Buttons */}

            <TouchableOpacity
              onPress={createCustomer}
              className="bg-green-600 p-4 rounded-xl mb-4"
            >
              <Text className="text-white text-center font-bold">
                Create Customer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} className="bg-gray-300 p-4 rounded-xl">
              <Text className="text-center font-bold">
                Cancel
              </Text>
            </TouchableOpacity>

          </ScrollView>

        </View>

      </View>

    </Modal>
  );
}