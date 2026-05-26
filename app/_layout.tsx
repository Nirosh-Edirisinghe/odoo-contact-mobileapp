import "react-native-gesture-handler";
import { Stack } from "expo-router";
import '@/global.css'
import { CustomerProvider } from '@/src/context/CustomerContext'
import { AuthProvider } from "@/src/context/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <CustomerProvider>
          <Stack screenOptions={{
            headerShown: false,
          }} />
        </CustomerProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
