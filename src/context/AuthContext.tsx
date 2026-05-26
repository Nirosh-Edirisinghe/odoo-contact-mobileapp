import { createContext, useContext, useEffect, useState, } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load user from storage
  useEffect(() => {

    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

      } catch (error) {
        console.log(error);

      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);


  // Login
  const login = async (data: any) => {
    setUser(data);

    await AsyncStorage.setItem(
      "user",
      JSON.stringify(data)
    );
  };


  // Logout
  const logout = async () => {
    setUser(null);    
    await AsyncStorage.removeItem(
      "user"
    );
    router.replace("/");
  };

  const value = { user, loading, login, logout, } 

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);