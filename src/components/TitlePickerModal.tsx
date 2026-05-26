import { Modal, View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

type Title = { id: number; name: string; };

type Props = {
  visible: boolean;
  titles: Title[];
  selectedTitle: Title | null;
  onSelect: (title: Title) => void;
  onClose: () => void;
};

const TitlePickerModal = ({
  visible,
  titles,
  selectedTitle,
  onSelect,
  onClose,
}: Props) => {

  const [search, setSearch] = useState("");

  const filtered = titles.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleClose = () => {
    setSearch("");
    onClose();
  };

  const handleSelect = (title: Title) => {
    setSearch("");
    onSelect(title);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl pt-5 px-5 h-[70%]">

          {/* Header */}
          <View className="flex-row justify-between items-center mb-3.5">
            <Text className="text-lg font-bold text-gray-900">Select Title</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={12}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View className="flex-row items-center bg-gray-100 rounded-xl px-3 mb-3">
            <Ionicons name="search-outline" size={16} color="#9CA3AF" />
            <TextInput
              placeholder="Search title…"
              value={search}
              onChangeText={setSearch}
              className="flex-1 py-2.5 px-2 text-sm text-gray-900"
              placeholderTextColor="#9CA3AF"
              autoFocus
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          {/* List */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = selectedTitle?.id === item.id;
              return (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  className={`flex-row items-center justify-between py-3.5 px-1 border-b border-gray-100 ${isSelected ? "bg-purple-50" : "bg-white"
                    }`}
                >
                  <Text
                    className={`text-base ${isSelected ? "text-odoo font-semibold" : "text-gray-700 font-normal"
                      }`}
                  >
                    {item.name}
                  </Text>
                  {isSelected && <Ionicons name="checkmark" size={18} color="#875A7B" />}
                </TouchableOpacity>
              );
            }}
          />

        </View>
      </View>
    </Modal>
  )
}

export default TitlePickerModal
