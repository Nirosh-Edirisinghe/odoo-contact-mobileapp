import "react-native-gesture-handler";
import { Stack } from "expo-router";
import '@/global.css'
import { CustomerProvider } from '@/src/context/CustomerContext'
import { AuthProvider } from "@/src/context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <CustomerProvider>
        <Stack screenOptions={{
          headerShown: false,
        }} />
      </CustomerProvider>
    </AuthProvider>
  );
}
