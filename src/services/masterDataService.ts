import axios from "axios";

// fetch Countries
export const fetchCountries = async (url: string) => {
  const res = await axios.post(`${url}/web/dataset/call_kw/res.country/search_read`, {
    jsonrpc: "2.0",
    params: {
      model: "res.country",
      method: "search_read",
      args: [[]],
      kwargs: { fields: ["id", "name"] },
    },
  });
  return res.data.result;
};

// fetch comanies
export const fetchCompanies = async (url: string) => {
  const res = await axios.post(`${url}/web/dataset/call_kw/res.partner/search_read`, {
    jsonrpc: "2.0",
    params: {
      model: "res.partner",
      method: "search_read",
      args: [[["company_type", "=", "company"]]],
      kwargs: { fields: ["id", "name"] },
    },
  });
  return res.data.result;
};

// fetch states
export const fetchStates = async (url: string, countryId?: number) => {
  const domain = countryId ? [[["country_id", "=", countryId]]] : [[]];

  const res = await axios.post(`${url}/web/dataset/call_kw/res.country.state/search_read`, {
    jsonrpc: "2.0",
    params: {
      model: "res.country.state",
      method: "search_read",
      args: domain,
      kwargs: { fields: ["id", "name", "country_id"] },
    },
  });
  return res.data.result;
};


export const fetchTitles = async (url: string) => {
  try {
    const res = await axios.post(
      `${url}/web/dataset/call_kw/res.partner.title/search_read`,
      {
        jsonrpc: "2.0",
        params: {
          model: "res.partner.title",
          method: "search_read",
          args: [[]],
          kwargs: {
            fields: ["id", "name"],
          },
        },
      },
      { withCredentials: true }
    );

    return (res.data.result);
  } catch (error) {
    console.log(error);
  }
};

export const fetchTags = async (url: string) => {
  try {
    const res = await axios.post(
      `${url}/web/dataset/call_kw/res.partner.category/search_read`,
      {
        jsonrpc: "2.0",
        params: {
          model: "res.partner.category",
          method: "search_read",
          args: [[]],
          kwargs: {
            fields: ["id", "name"],
          },
        },
      },
      { withCredentials: true }
    );

    return (res.data.result);
  } catch (error) {
    console.log(error);
  }
};