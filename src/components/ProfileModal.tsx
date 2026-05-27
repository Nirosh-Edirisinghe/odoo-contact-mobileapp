import React, { useEffect, useState } from "react";
import { Modal, View, Text, Pressable } from "react-native";
import axios from "axios";
import { useAuth } from "@/src/context/AuthContext";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const ProfileModal = ({ visible, onClose }: Props) => {
  const { user } = useAuth();
  const url = user?.url;
  const uid = user?.uid;

  const [profile, setProfile] = useState<any>(null);

  const fetchProfile = async () => {
    if (!url || !uid) return;

    try {
      const res = await axios.post(
        `${url}/web/dataset/call_kw`,
        {
          jsonrpc: "2.0",
          method: "call",
          params: {
            model: "res.users",
            method: "read",
            args: [
              [Number(uid)],
              ["name",
                "email",
                "phone",
              ]
            ],
            kwargs: {},
          },
        },
        { withCredentials: true }
      );

      if (res.data.result?.length) {
        setProfile(res.data.result[0]);
      }
    } catch (err) {
      console.log("Profile fetch error:", err);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchProfile();
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="bg-white w-90 p-5 rounded-2xl">

          <Text className="text-2xl font-extrabold mb-4 text-center text-purple-900">
            My Profile
          </Text>

          {!profile ? (
            <Text className="text-center text-gray-500">
              Loading...
            </Text>
          ) : (
            <View className="bg-gray-100 p-4 rounded-2xl">

              {/* Name */}
              <View className="mb-3">
                <Text className="text-gray-500 text-sm">Name</Text>
                <Text className="text-lg font-bold text-gray-800">
                  {profile.name}
                </Text>
              </View>

              {/* Email */}
              <View className="mb-3">
                <Text className="text-gray-500 text-sm">Email</Text>
                <Text className="text-lg font-semibold text-gray-800">
                  {profile.email}
                </Text>
              </View>

              {/* Phone */}
              <View className="mb-3">
                <Text className="text-gray-500 text-sm">Phone</Text>
                <Text className="text-lg font-semibold text-gray-800">
                  {profile.phone || "N/A"}
                </Text>
              </View>

            </View>
          )}
          <Pressable
            onPress={onClose}
            className="mt-4 bg-purple-600 p-2 rounded-lg"
          >
            <Text className="text-white font-semibold text-center">
              Close
            </Text>
          </Pressable>

        </View>
      </View>
    </Modal>
  );
};

export default ProfileModal;