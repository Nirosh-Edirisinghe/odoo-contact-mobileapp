// context/MasterDataContext.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  fetchCountries,
  fetchCompanies,
  fetchStates,
  fetchTitles,
  fetchTags,
} from "../services/masterDataService";
import { Country, Company, State, Title, Tag } from "../services/masterDataTypes";
import { useAuth } from "./AuthContext";


type MasterDataContextType = {
  countries: Country[];
  companies: Company[];
  states: State[];
  titles: Title[];
  tags: Tag[];
  loadStates: (countryId: number) => void;
};

const MasterDataContext = createContext<MasterDataContextType | null>(null);

export const MasterDataProvider = ({ children }: any) => {
  const [countries, setCountries] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [states, setStates] = useState([]);
  const [titles, setTitles] = useState([]);
  const [tags, setTags] = useState([]);
  const { user } = useAuth();
  const url = user?.url;

  useEffect(() => {
    loadInitialData();
  }, [user]);

  const loadInitialData = async () => {
    if (!user?.url) return;
    try {
      const [countryData, companyData, titleData, tagData] =
        await Promise.all([
          fetchCountries(user.url),
          fetchCompanies(user.url),
          fetchTitles(user.url),
          fetchTags(user.url),
        ]);

      setCountries(countryData);
      setCompanies(companyData);
      setTitles(titleData);
      setTags(tagData);
    } catch (err) {
      console.log(err);
    }
  };

  const loadStates = async (countryId: number) => {
    const data = await fetchStates(user.url, countryId);
    setStates(data);
  };

  return (
    <MasterDataContext.Provider
      value={{
        countries,
        companies,
        states,
        titles,
        tags,
        loadStates,
      }}
    >
      {children}
    </MasterDataContext.Provider>
  );
};

export const useMasterData = () => {
  const context = useContext(MasterDataContext);
  if (!context) {
    throw new Error("useMasterData must be used inside MasterDataProvider");
  }
  return context;
};