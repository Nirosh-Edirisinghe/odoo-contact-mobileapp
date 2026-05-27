import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, FlatList } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import CountryPickerModal from "./CountryPickerModal";
import ComanyPickerModal from "./ComanyPickerModal";
import StatePickerModal from "./StatePickerModal";
import TitlePickerModal from "./TitlePickerModal";
import TagPickerModal from "./TagPickerModal";

export default function CustomerModal({ visible, onClose, url, refreshCustomers }: any) {

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

  type Country = { id: number; name: string };
  type Company = { id: number; name: string; };
  type State = { id: number; name: string; country_id: [number, string]; };
  type Title = { id: number; name: string; };
  type Tag = { id: number; name: string; };

  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [comanyPickerVisible, setComanyPickerVisible] = useState(false);

  const [states, setStates] = useState<State[]>([]);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [statePickerVisible, setStatePickerVisible] = useState(false);

  const [titles, setTitles] = useState<Title[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<Title | null>(null);
  const [titlePickerVisible, setTitlePickerVisible] = useState(false);

  const [tags, setTags] = useState<Tag[]>([]);
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

  const fetchCountries = async () => {
    try {
      const res = await axios.post(
        `${url}/web/dataset/call_kw/res.country/search_read`,
        {
          jsonrpc: "2.0",
          params: {
            model: "res.country",
            method: "search_read",
            args: [[]],
            kwargs: { fields: ["id", "name"] },
          },
        },
        { withCredentials: true }
      );
      setCountries(res.data.result);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.post(
        `${url}/web/dataset/call_kw/res.partner/search_read`,
        {
          jsonrpc: "2.0",
          params: {
            model: "res.partner",
            method: "search_read",
            args: [
              [["company_type", "=", "company"]]  // 🔥 IMPORTANT FILTER
            ],
            kwargs: {
              fields: ["id", "name"],
            },
          },
        },
        { withCredentials: true }
      );
      setCompanies(res.data.result);
    } catch (error) {
      console.log(error);
    }
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

  const fetchStates = async (countryId?: number) => {
    const domain = countryId
      ? [[["country_id", "=", countryId]]]
      : [[]];
    try {
      const res = await axios.post(
        `${url}/web/dataset/call_kw/res.country.state/search_read`,
        {
          jsonrpc: "2.0",
          params: {
            model: "res.country.state",
            method: "search_read",
            args: domain,
            kwargs: {
              fields: ["id", "name", "country_id"],
            },
          },
        },
        { withCredentials: true }
      );

      setStates(res.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTitles = async () => {
    try {
      const res = await axios.post(
        `${url}/web/dataset/call_kw/res.partner.title/search_read`,
        {
          jsonrpc: "2.0",
          params: {
            model: "res.partner.title",
            method: "search_read",
            args: [[]],
            kwargs: {
              fields: ["id", "name"],
            },
          },
        },
        { withCredentials: true }
      );

      setTitles(res.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await axios.post(
        `${url}/web/dataset/call_kw/res.partner.category/search_read`,
        {
          jsonrpc: "2.0",
          params: {
            model: "res.partner.category",
            method: "search_read",
            args: [[]],
            kwargs: {
              fields: ["id", "name"],
            },
          },
        },
        { withCredentials: true }
      );

      setTags(res.data.result);
    } catch (error) {
      console.log(error);
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

  useEffect(() => {
    if (visible) {
      fetchCompanies();
      fetchStates();
      fetchCountries();
      fetchTitles();
      fetchTags();
    }
  }, [visible]);

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
                <Text className="text-2xl font-bold text-gray-900">Add Customer</Text>
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
                    <Text className={`font-semibold text-sm ${companyType === type ? "text-white" : "text-gray-500"}`}>
                      {type === "person" ? "Individual" : "Company"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Name */}
              <Text className="text-sm font-semibold text-gray-700 mb-1.5">
                {companyType === "company" ? "Company Name" : "Name"}
                <Text className="text-red-500"> *</Text>
              </Text>
              <TextInput placeholder={companyType === "person" ? "e.g. Brandon Freeman" : "e.g. Lumber Inc"} value={name} onChangeText={setName} className="border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3 text-sm text-gray-900 bg-gray-50 mb-3.5" placeholderTextColor="#9CA3AF" />

              {/* Parent Company */}
              {companyType === "person" && (
                <>
                  <Text className="text-sm font-semibold text-gray-700 mb-1.5">Company</Text>
                  <TouchableOpacity
                    onPress={() => setComanyPickerVisible(true)}
                    className="flex-row items-center border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3.5 bg-gray-50 mb-3.5"
                  >
                    <Text className={`flex-1 text-sm ${selectedCompany ? "text-gray-900" : "text-gray-400"}`}>
                      {selectedCompany ? selectedCompany.name : "Select Company"}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </>
              )}

              {/* Street */}
              <Text className="text-sm font-semibold text-gray-700 mb-1.5">Street</Text>
              <TextInput placeholder="Street…" value={street} onChangeText={setStreet} className="border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3 text-sm text-gray-900 bg-gray-50 mb-3.5" placeholderTextColor="#9CA3AF" />

              {/* Street 2 */}
              <Text className="text-sm font-semibold text-gray-700 mb-1.5">Street 2</Text>
              <TextInput placeholder="Street2…" value={street2} onChangeText={setStreet2} className="border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3 text-sm text-gray-900 bg-gray-50 mb-3.5" placeholderTextColor="#9CA3AF" />

              {/* City + ZIP */}
              <View className="flex-row gap-2">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-700 mb-1.5">City</Text>
                  <TextInput placeholder="City" value={city} onChangeText={setCity} className="border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3 text-sm text-gray-900 bg-gray-50 mb-3.5" placeholderTextColor="#9CA3AF" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-700 mb-1.5">ZIP</Text>
                  <TextInput placeholder="00000" value={zip} onChangeText={setZip} className="border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3 text-sm text-gray-900 bg-gray-50 mb-3.5" placeholderTextColor="#9CA3AF" keyboardType="numeric" />
                </View>
              </View>

              {/* State */}
              <Text className="text-sm font-semibold text-gray-700 mb-1.5">State</Text>
              <TouchableOpacity
                onPress={() => setStatePickerVisible(true)}
                className="flex-row items-center border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3.5 bg-gray-50 mb-3.5"
              >
                <Text className={`flex-1 text-sm ${selectedState ? "text-gray-900" : "text-gray-400"}`}>
                  {selectedState ? selectedState.name : "Select State"}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
              </TouchableOpacity>

              {/* Country — uses CountryPickerModal */}
              <Text className="text-sm font-semibold text-gray-700 mb-1.5">Country</Text>
              <TouchableOpacity
                onPress={() => setCountryPickerVisible(true)}
                className="flex-row items-center border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3.5 bg-gray-50 mb-3.5"
              >
                <Text className={`flex-1 text-sm ${selectedCountry ? "text-gray-900" : "text-gray-400"}`}>
                  {selectedCountry ? selectedCountry.name : "Select Country"}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
              </TouchableOpacity>

              {/* Tax ID */}
              <Text className="text-sm font-semibold text-gray-700 mb-1.5">Tax ID</Text>
              <TextInput placeholder="/ if not aplicable" value={vat} onChangeText={setVat} className="border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3 text-sm text-gray-900 bg-gray-50 mb-3.5" placeholderTextColor="#9CA3AF" />

              {/* Job Position */}
              {companyType === "person" && (
                <>
                  <Text className="text-sm font-semibold text-gray-700 mb-1.5">Job Position</Text>
                  <TextInput placeholder="e.g. Sales Manager" value={jobPosition} onChangeText={setJobPosition} className="border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3 text-sm text-gray-900 bg-gray-50 mb-3.5" placeholderTextColor="#9CA3AF" />
                </>
              )}

              {/* Phone */}
              <Text className="text-sm font-semibold text-gray-700 mb-1.5">Phone</Text>
              <TextInput placeholder="+1 555 000 0000" value={phone} onChangeText={setPhone} className="border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3 text-sm text-gray-900 bg-gray-50 mb-3.5" placeholderTextColor="#9CA3AF" keyboardType="phone-pad" />

              {/* Mobile */}
              <Text className="text-sm font-semibold text-gray-700 mb-1.5">Mobile</Text>
              <TextInput placeholder="+1 555 000 0001" value={mobile} onChangeText={setMobile} className="border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3 text-sm text-gray-900 bg-gray-50 mb-3.5" placeholderTextColor="#9CA3AF" keyboardType="phone-pad" />

              {/* Email */}
              <Text className="text-sm font-semibold text-gray-700 mb-1.5">Email</Text>
              <TextInput placeholder="hello@example.com" value={email} onChangeText={setEmail} className="border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3 text-sm text-gray-900 bg-gray-50 mb-3.5" placeholderTextColor="#9CA3AF" keyboardType="email-address" autoCapitalize="none" />

              {/* website */}
              <Text className="text-sm font-semibold text-gray-700 mb-1.5">Website</Text>
              <TextInput placeholder="e.g. https://www.odoo.com" value={website} onChangeText={setWebSite} className="border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3 text-sm text-gray-900 bg-gray-50 mb-3.5" placeholderTextColor="#9CA3AF" keyboardType="email-address" />

              {/* Title */}
              {companyType === "person" && (
                <>
                  <Text className="text-sm font-semibold text-gray-700 mb-1.5">Title</Text>
                  <TouchableOpacity
                    onPress={() => setTitlePickerVisible(true)}
                    className="flex-row items-center border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3.5 bg-gray-50 mb-3.5"
                  >
                    <Text className={`flex-1 text-sm ${selectedTitle ? "text-gray-900" : "text-gray-400"}`}>
                      {selectedTitle ? selectedTitle.name : "e.g. Mister"}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </>
              )}

              {/* Tags */}
              <Text className="text-sm font-semibold text-gray-700 mb-1.5">Tags</Text>
              <TouchableOpacity
                onPress={() => setTagPickerVisible(true)}
                className="flex-row items-center border-[1.5px] border-gray-200 rounded-xl px-3.5 py-3.5 bg-gray-50 mb-3.5"
              >
                <Text className={`flex-1 text-sm ${selectedTags.length > 0 ? "text-gray-900" : "text-gray-400"}`}>
                  {selectedTags.length > 0
                    ? selectedTags.map(t => t.name).join(", ")
                    : "e.g. 'B2B','VIP','Consulting'"}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
              </TouchableOpacity>

              {/* Create button */}
              <TouchableOpacity onPress={createCustomer} className="flex-row items-center justify-center bg-odoo-light rounded-2xl py-4 mt-2 mb-2.5">
                <Ionicons name="checkmark-circle-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text className="text-white font-bold text-base">Create Customer</Text>
              </TouchableOpacity>

              {/* Cancel button */}
              <TouchableOpacity onPress={onClose} className="items-center bg-gray-100 rounded-2xl py-3.5">
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
          fetchStates(country.id);
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
