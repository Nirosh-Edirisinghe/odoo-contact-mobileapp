// types/masterDataTypes.ts

export type Country = {
  id: number;
  name: string;
};

export type Company = {
  id: number;
  name: string;
};

export type State = {
  id: number;
  name: string;
  country_id: [number, string];
};

export type Title = {
  id: number;
  name: string;
};

export type Tag = {
  id: number;
  name: string;
};