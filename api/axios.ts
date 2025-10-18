import axios from 'axios';
import { mmkv } from '../query/persistMMKV';

export const api = axios.create({ baseURL: 'https:

api.interceptors.request.use(cfg => {
  const token = mmkv.getString('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
