import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";
import { useAuth } from "./AuthContext";

const CustomerContext = createContext<any>(null);

export const CustomerProvider = ({
  children,
}: any) => {
  type Tag = { id: number; name: string };
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);

  const fetchCustomers = async (
    url: string
  ) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${url}/web/dataset/call_kw/res.partner/search_read`,
        {
          jsonrpc: "2.0",
          params: {
            model: "res.partner",
            method: "search_read",
            args: [],
            kwargs: {
              fields: [
                "name",
                "email",
                "phone",
                "image_1920"
              ],
              limit: 100,
            },
          },
        }
      );

      setCustomers(response.data.result);
    } catch (error) {
      console.log("Error fetching custormers ini", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async (url: string) => {
    try {
      const response = await axios.post(
        `${url}/web/dataset/call_kw/res.partner.category/search_read`,
        {
          jsonrpc: "2.0",
          params: {
            model: "res.partner.category",
            method: "search_read",
            args: [],
            kwargs: {
              fields: ["id", "name"],
            },
          },
        }
      );

      setTags(response.data.result);
    } catch (error) {
      console.log("Error fetching tags", error);
    }
  };

  const value = {
    customers,
    loading,
    fetchCustomers,
    tags,
    fetchTags
  }

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () =>
  useContext(CustomerContext);