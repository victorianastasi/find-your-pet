export type Item = {
  name: string;
  description: string;
  age: string;
  type: string;
  image: string;
  district: string;
  location: string;
  date: string;
  email: string;
  userName: string;
  phone: string;
  id?: string;
};
export type User = {
  id: string;
  phone: string;
  email: string;
  userName: string;
};
export type UserDBType = {
  phone: string;
  email: string;
  userName: string;
};
