import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, FlatList } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import CountryPickerModal from "./CountryPickerModal";
import ComanyPickerModal from "./ComanyPickerModal";
import StatePickerModal from "./StatePickerModal";
import TitlePickerModal from "./TitlePickerModal";
import TagPickerModal from "./TagPickerModal";
import { useMasterData } from "../context/MasterDataContext";
import { Country, Company, State, Title, Tag } from "../services/masterDataTypes";

export default function CustomerModal({ visible, onClose, url, refreshCustomers, customer }: any) {

  const isEdit = !!customer;
  const [companyType, setCompanyType] = useState("person");
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [street2, setStreet2] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [vat, setVat] = useState("");
  const [jobPosition, setJobPosition] = useState("");
  const [phone, setPhone] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebSite] = useState("");

  const {
    countries,
    companies,
    states,
    titles,
    tags,
    loadStates,
  } = useMasterData();


  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [comanyPickerVisible, setComanyPickerVisible] = useState(false);

  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [statePickerVisible, setStatePickerVisible] = useState(false);

  const [selectedTitle, setSelectedTitle] = useState<Title | null>(null);
  const [titlePickerVisible, setTitlePickerVisible] = useState(false);

  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [tagPickerVisible, setTagPickerVisible] = useState(false);

  const clearForm = () => {
    setName("");
    setStreet("");
    setStreet2("");
    setCity("");
    setVat("");
    setZip("");
    setJobPosition("");
    setMobile("");
    setEmail("");
    setPhone("");
    setWebSite("");
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCompany(null);
    setSelectedTags([]);
    setSelectedTitle(null);

  };

  const fetchCompanyDetails = async (companyId: number) => {
    try {
      const response = await axios.post(
        `${url}/web/dataset/call_kw/res.partner/read`,
        {
          jsonrpc: "2.0",
          params: {
            model: "res.partner",
            method: "read",
            args: [[companyId]],
            kwargs: {
              fields: [
                "street",
                "street2",
                "city",
                "zip",
                "country_id",
                "state_id",
                "vat",
              ],
            },
          },
        }
      );
      const company = response.data.result[0];
      console.log(company);

      // ✅ Auto-fill fields
      setStreet(company.street || "");
      setStreet2(company.street2 || "");
      setCity(company.city || "");
      setZip(company.zip || "");

      // relational fields come as [id, name]
      setSelectedCountry(
        company.country_id
          ? { id: company.country_id[0], name: company.country_id[1] }
          : null
      );

      setSelectedState(
        company.state_id
          ? {
            id: company.state_id[0],
            name: company.state_id[1],
            country_id: company.country_id || [0, ""],
          }
          : null
      );

      setVat(company.vat || "");
    } catch (error) {
      console.log("Error fetching company details:", error);
    }
  };

  const createCustomer = async () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Name is required.");
      return;
    }
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
        website
      };

      // Individual only
      if (companyType === "person") {
        payload.function = jobPosition;

        if (selectedCompany) {
          payload.parent_id = selectedCompany.id;
        }
      }
      if (selectedState) {
        payload.state_id = selectedState.id;
      }
      if (selectedCountry) {
        payload.country_id = selectedCountry.id;
      }
      if (selectedTitle) {
        payload.title = selectedTitle.id;
      }
      if (selectedTags.length > 0) {
        payload.category_id = [
          [6, 0, selectedTags.map(tag => tag.id)]
        ];
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
        { withCredentials: true }
      );

      Alert.alert("Success", "Customer created");
      refreshCustomers(url);
      clearForm()
      onClose();
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Failed to create customer");
    }
  };

  // update function
  const updateCustomer = async () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Name is required.");
      return;
    }

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
        website,
      };

      // Individual logic
      if (companyType === "person") {
        payload.function = jobPosition;

        if (selectedCompany) {
          payload.parent_id = selectedCompany.id;
        } else {
          payload.parent_id = false; // clear if removed
        }
      }

      // Location
      payload.country_id = selectedCountry ? selectedCountry.id : false;
      payload.state_id = selectedState ? selectedState.id : false;

      // Title
      payload.title = selectedTitle ? selectedTitle.id : false;

      // Tags (many2many)
      payload.category_id = [
        [6, 0, selectedTags.map(tag => tag.id)]
      ];

      await axios.post(
        `${url}/web/dataset/call_kw/res.partner/write`,
        {
          jsonrpc: "2.0",
          params: {
            model: "res.partner",
            method: "write",
            args: [[customer.id], payload], // ✅ correct
            kwargs: {},
          },
        },
        { withCredentials: true }
      );

      Alert.alert("Success", "Customer updated");
      refreshCustomers(url);
      onClose();

    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Failed to update customer");
    }
  };

  const handleSubmit = () => {
    if (isEdit) {
      updateCustomer();
    } else {
      createCustomer();
    }
  };

  useEffect(() => {
    if (selectedCountry) {
      loadStates(selectedCountry.id);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (customer) {
      setName(customer.name || "");
      setStreet(customer.street || "");
      setCity(customer.city || "");
      setZip(customer.zip || "");
      setVat(customer.vat || "");
      setPhone(customer.phone || "");
      setMobile(customer.mobile || "");
      setEmail(customer.email || "");
      setWebSite(customer.website || "");

      //  Country
      setSelectedCountry(
        customer.country_id
          ? { id: customer.country_id[0], name: customer.country_id[1] }
          : null
      );

      //  State
      setSelectedState(
        customer.state_id
          ? {
            id: customer.state_id[0],
            name: customer.state_id[1],
            country_id: customer.country_id || [0, ""],
          }
          : null
      );

      //  Company (parent_id)
      setSelectedCompany(
        customer.parent_id
          ? { id: customer.parent_id[0], name: customer.parent_id[1] }
          : null
      );

      //  Title
      setSelectedTitle(
        customer.title
          ? { id: customer.title[0], name: customer.title[1] }
          : null
      );

      //  Tags (many2many)
      if (customer.category_id && customer.category_id.length > 0) {
        const mappedTags = tags.filter(tag =>
          customer.category_id.includes(tag.id)
        );
        setSelectedTags(mappedTags);
      } else {
        setSelectedTags([]);
      }
    }
  }, [customer, tags]);

  return (
    <>
      {/* ── Main Modal ── */}
      <Modal visible={visible} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl px-5 pt-5 max-h-[92%]">
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 32 }}
            >
              {/* Header */}
              <View className="flex-row justify-between items-center mb-5">
                <Text className="text-2xl font-bold text-gray-900">{isEdit ? "Edit Customer" : "Add Customer"}</Text>
                <TouchableOpacity onPress={onClose} hitSlop={12}>
                  <Ionicons name="close" size={26} color="#374151" />
                </TouchableOpacity>
              </View>

              {/* Type toggle */}
              <View className="flex-row mb-5 gap-2">
                {["person", "company"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setCompanyType(type)}
                    className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${companyType === type ? "bg-odoo-light" : "bg-gray-100"}
                    `}
                  >
                    <Ionicons
                      name={type === "person" ? "person-outline" : "business-outline"}
                      size={16}
                      color={companyType === type ? "#fff" : "#6B7280"}
                      style={{ marginRight: 6 }}
                    />
                    <Text className={`font-semibold text-md ${companyType === type ? "text-white" : "text-gray-500"}`}>
                      {type === "person" ? "Individual" : "Company"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Name */}
              <Text className="text-md font-semibold text-gray-600 mb-1.5">
                {companyType === "company" ? "Company Name" : "Name"}
                <Text className="text-red-500"> *</Text>
              </Text>
              <TextInput placeholder={companyType === "person" ? "e.g. Brandon Freeman" : "e.g. Lumber Inc"} value={name} onChangeText={setName} className="border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3 text-md text-gray-900 bg-gray-50 mb-3.5" placeholderTextColor="#9CA3AF" />

              {/* Parent Company */}
              {companyType === "person" && (
                <>
                  <Text className="text-md font-semibold text-gray-600 mb-1.5">Company</Text>
                  <TouchableOpacity
                    onPress={() => setComanyPickerVisible(true)}
                    className="flex-row items-center border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3.5 bg-gray-50 mb-3.5"
                  >
                    <Text className={`flex-1 text-md ${selectedCompany ? "text-gray-900" : "text-gray-400"}`}>
                      {selectedCompany ? selectedCompany.name : "Select Company"}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </>
              )}

              {/* Street */}
              <Text className="text-md font-semibold text-gray-600 mb-1.5">Street</Text>
              <TextInput placeholder="Street…" value={street} onChangeText={setStreet} className="border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3 text-md text-gray-900 bg-gray-50 mb-3.5" placeholderTextColor="#9CA3AF" />

              {/* Street 2 */}
              <Text className="text-md font-semibold text-gray-600 mb-1.5">Street 2</Text>
              <TextInput placeholder="Street2…" value={street2} onChangeText={setStreet2} className="border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3 text-md text-gray-900 bg-gray-50 mb-3.5" placeholderTextColor="#9CA3AF" />

              {/* City + ZIP */}
              <View className="flex-row gap-2">
                <View className="flex-1">
                  <Text className="text-md font-semibold text-gray-600 mb-1.5">City</Text>
                  <TextInput placeholder="City" value={city} onChangeText={setCity} className="border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3 text-md text-gray-900 bg-gray-50 mb-3.5" placeholderTextColor="#9CA3AF" />
                </View>
                <View className="flex-1">
                  <Text className="text-md font-semibold text-gray-600 mb-1.5">ZIP</Text>
                  <TextInput placeholder="00000" value={zip} onChangeText={setZip} className="border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3 text-md text-gray-900 bg-gray-50 mb-3.5" placeholderTextColor="#9CA3AF" keyboardType="numeric" />
                </View>
              </View>

              {/* State */}
              <Text className="text-md font-semibold text-gray-600 mb-1.5">State</Text>
              <TouchableOpacity
                onPress={() => setStatePickerVisible(true)}
                className="flex-row items-center border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3.5 bg-gray-50 mb-3.5"
              >
                <Text className={`flex-1 text-md ${selectedState ? "text-gray-900" : "text-gray-400"}`}>
                  {selectedState ? selectedState.name : "Select State"}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
              </TouchableOpacity>

              {/* Country — uses CountryPickerModal */}
              <Text className="text-md font-semibold text-gray-600 mb-1.5">Country</Text>
              <TouchableOpacity
                onPress={() => setCountryPickerVisible(true)}
                className="flex-row items-center border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3.5 bg-gray-50 mb-3.5"
              >
                <Text className={`flex-1 text-md ${selectedCountry ? "text-gray-900" : "text-gray-400"}`}>
                  {selectedCountry ? selectedCountry.name : "Select Country"}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
              </TouchableOpacity>

              {/* Tax ID */}
              <Text className="text-md font-semibold text-gray-600 mb-1.5">Tax ID</Text>
              <TextInput placeholder="/ if not aplicable" value={vat} onChangeText={setVat} className="border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3 text-md text-gray-900 bg-gray-50 mb-3.5" placeholderTextColor="#9CA3AF" />

              {/* Job Position */}
              {companyType === "person" && (
                <>
                  <Text className="text-md font-semibold text-gray-600 mb-1.5">Job Position</Text>
                  <TextInput placeholder="e.g. Sales Manager" value={jobPosition} onChangeText={setJobPosition} className="border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3 text-md text-gray-900 bg-gray-50 mb-3.5" placeholderTextColor="#9CA3AF" />
                </>
              )}

              {/* Phone */}
              <Text className="text-md font-semibold text-gray-600 mb-1.5">Phone</Text>
              <TextInput placeholder="+1 555 000 0000" value={phone} onChangeText={setPhone} className="border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3 text-md text-gray-900 bg-gray-50 mb-3.5" placeholderTextColor="#9CA3AF" keyboardType="phone-pad" />

              {/* Mobile */}
              <Text className="text-md font-semibold text-gray-600 mb-1.5">Mobile</Text>
              <TextInput placeholder="+1 555 000 0001" value={mobile} onChangeText={setMobile} className="border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3 text-md text-gray-900 bg-gray-50 mb-3.5" placeholderTextColor="#9CA3AF" keyboardType="phone-pad" />

              {/* Email */}
              <Text className="text-md font-semibold text-gray-600 mb-1.5">Email</Text>
              <TextInput placeholder="hello@example.com" value={email} onChangeText={setEmail} className="border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3 text-md text-gray-900 bg-gray-50 mb-3.5" placeholderTextColor="#9CA3AF" keyboardType="email-address" autoCapitalize="none" />

              {/* website */}
              <Text className="text-md font-semibold text-gray-600 mb-1.5">Website</Text>
              <TextInput placeholder="e.g. https://www.odoo.com" value={website} onChangeText={setWebSite} className="border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3 text-md text-gray-900 bg-gray-50 mb-3.5" placeholderTextColor="#9CA3AF" keyboardType="email-address" />

              {/* Title */}
              {companyType === "person" && (
                <>
                  <Text className="text-md font-semibold text-gray-600 mb-1.5">Title</Text>
                  <TouchableOpacity
                    onPress={() => setTitlePickerVisible(true)}
                    className="flex-row items-center border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3.5 bg-gray-50 mb-3.5"
                  >
                    <Text className={`flex-1 text-md ${selectedTitle ? "text-gray-900" : "text-gray-400"}`}>
                      {selectedTitle ? selectedTitle.name : "e.g. Mister"}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </>
              )}

              {/* Tags */}
              <Text className="text-md font-semibold text-gray-600 mb-1.5">Tags</Text>
              <TouchableOpacity
                onPress={() => setTagPickerVisible(true)}
                className="flex-row items-center border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3.5 bg-gray-50 mb-3.5"
              >
                <Text className={`flex-1 text-md ${selectedTags.length > 0 ? "text-gray-900" : "text-gray-400"}`}>
                  {selectedTags.length > 0
                    ? selectedTags.map(t => t.name).join(", ")
                    : "e.g. 'B2B','VIP','Consulting'"}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
              </TouchableOpacity>

              {/* Create button */}
              <TouchableOpacity onPress={handleSubmit} className="flex-row items-center justify-center bg-odoo-light rounded-2xl py-4 mt-2 mb-2.5">
                <Ionicons name="checkmark-circle-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text className="text-white font-bold text-base">{isEdit ? "Update Customer" : "Add Customer"}</Text>
              </TouchableOpacity>

              {/* Cancel button */}
              <TouchableOpacity
                onPress={() => {
                  onClose(),
                    clearForm()
                }}
                className="items-center bg-gray-100 rounded-2xl py-3.5">
                <Text className="text-gray-500 font-semibold text-base">Cancel</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── Country Picker (extracted component) ── */}
      <CountryPickerModal
        visible={countryPickerVisible}
        countries={countries}
        selectedCountry={selectedCountry}
        onSelect={(country) => {
          setSelectedCountry(country);
          setCountryPickerVisible(false);
          // ✅ RESET STATE (because country changed)
          setSelectedState(null);

          // ✅ FETCH NEW STATES
        }}
        onClose={() => setCountryPickerVisible(false)}
      />

      {/* ── Company Picker ── */}
      <ComanyPickerModal
        visible={comanyPickerVisible}
        companies={companies}
        selectedCompany={selectedCompany}
        onSelect={async (company) => {
          setSelectedCompany(company);
          setComanyPickerVisible(false);
          await fetchCompanyDetails(company.id);
        }}
        onClose={() => setComanyPickerVisible(false)}
      />

      {/* ── State Picker ── */}
      <StatePickerModal
        visible={statePickerVisible}
        states={states}
        selectedState={selectedState}
        onSelect={(state) => {
          setSelectedState(state);
          setStatePickerVisible(false);
          // ✅ AUTO SET COUNTRY FROM STATE
          if (state.country_id) {
            const [countryId, countryName] = state.country_id;

            setSelectedCountry({
              id: countryId,
              name: countryName,
            });
          }
        }}
        onClose={() => setStatePickerVisible(false)}
      />

      {/* ── Title Picker ── */}
      <TitlePickerModal
        visible={titlePickerVisible}
        titles={titles}
        selectedTitle={selectedTitle}
        onSelect={(title) => {
          setSelectedTitle(title);
          setTitlePickerVisible(false);
        }}
        onClose={() => setTitlePickerVisible(false)}
      />

      {/* tag */}
      <TagPickerModal
        visible={tagPickerVisible}
        tags={tags}
        selectedTags={selectedTags}
        onChange={(newTags) => {
          setSelectedTags(newTags);
          setTagPickerVisible(false)
        }}
        onClose={() => setTagPickerVisible(false)}
      />
    </>
  );
}
