import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

const CustomerContext = createContext<any>(null);

export const CustomerProvider = ({
  children,
}: any) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    customers,
        loading,
        fetchCustomers,
  }

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () =>
  useContext(CustomerContext);