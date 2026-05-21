import { Stack } from "expo-router";
import '@/global.css'
import { CustomerProvider } from '@/src/context/CustomerContext'

export default function RootLayout() {
  return (
    <CustomerProvider>
      <Stack />
    </CustomerProvider>
  );
}
