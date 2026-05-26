import { Modal, View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

type Tag = { id: number; name: string };

type Props = {
  visible: boolean;
  tags: Tag[];
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
  onClose: () => void;
};

const TagPickerModal = ({
  visible,
  tags,
  selectedTags,
  onChange,
  onClose,
}: Props) => {

  const [search, setSearch] = useState("");

  const filtered = tags.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const isSelected = (tag: Tag) =>
    selectedTags.some(t => t.id === tag.id);

  const toggleTag = (tag: Tag) => {
    if (isSelected(tag)) {
      onChange(selectedTags.filter(t => t.id !== tag.id));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  const handleClose = () => {
    setSearch("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl pt-5 px-5 h-[70%]">

          {/* Header */}
          <View className="flex-row justify-between items-center mb-3.5">
            <Text className="text-lg font-bold">Select Tags</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View className="flex-row items-center bg-gray-100 rounded-xl px-3 mb-3">
            <Ionicons name="search-outline" size={16} color="#9CA3AF" />
            <TextInput
              placeholder="Search tags…"
              value={search}
              onChangeText={setSearch}
              className="flex-1 py-2 px-2"
            />
          </View>

          {/* List */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => {
              const selected = isSelected(item);

              return (
                <TouchableOpacity
                  onPress={() => toggleTag(item)}
                  className={`flex-row justify-between p-3 border-b border-gray-100 ${
                    selected ? "bg-purple-50" : "bg-white"
                  }`}
                >
                  <Text>{item.name}</Text>
                  {selected && (
                    <Ionicons name="checkmark" size={18} color="#875A7B" />
                  )}
                </TouchableOpacity>
              );
            }}
          />

          {/* Done button */}
          <TouchableOpacity
            onPress={handleClose}
            className="bg-odoo py-3 rounded-xl mt-3"
          >
            <Text className="text-white text-center font-bold">
              Done
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default TagPickerModal;