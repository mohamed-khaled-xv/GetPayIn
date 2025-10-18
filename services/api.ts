import axios from 'axios';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();
const BASE_URL = 'https://dummyjson.com';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  console.log('🌐 API Request:', {
    url: `${config.baseURL}${config.url}`,
    method: config.method,
    data: config.data,
  });
  
  const token = storage.getString('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.log('❌ API Error:', {
      url: error.config?.url,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
  role?: 'user' | 'admin';
}

export interface ProductMeta {
  videoOffer: string | null;
  videoThumbnail: string | null;
}

export interface ProductReview {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ReturnPolicy {
  isReturnable: boolean;
  storePickup: boolean;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  meta?: ProductMeta;
  reviews?: ProductReview[];
  returnPolicy?: ReturnPolicy;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface DeleteProductResponse {
  id: number;
  isDeleted: boolean;
  deletedOn: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  validateSession: async (): Promise<LoginResponse> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const productsApi = {
  getAllProducts: async (): Promise<ProductsResponse> => {
    const response = await api.get('/products');
    return response.data;
  },
  
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/products/categories');
    return response.data;
  },
  
  getProductsByCategory: async (category: string): Promise<ProductsResponse> => {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  },
  
  deleteProduct: async (id: number): Promise<DeleteProductResponse> => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default api;