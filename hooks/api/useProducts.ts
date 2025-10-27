import NetInfo from '@react-native-community/netinfo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Product, ProductsResponse, productsApi } from '../../services/api';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAllProducts,
    staleTime: 1000 * 60 * 5,
    gcTime: Infinity, // Keep in cache indefinitely for offline access
    networkMode: 'offlineFirst', // Use cache first when offline
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: productsApi.getCategories,
    staleTime: 1000 * 60 * 30,
    gcTime: Infinity, // Keep in cache indefinitely for offline access
    networkMode: 'offlineFirst', // Use cache first when offline
  });
};

export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['products-by-category', category],
    queryFn: () => productsApi.getProductsByCategory(category),
    enabled: !!category,
    staleTime: 1000 * 60 * 5,
    gcTime: Infinity, // Keep in cache indefinitely for offline access
    networkMode: 'offlineFirst', // Use cache first when offline
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      // Check network status before attempting delete
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        throw new Error('No internet connection. Please try again when online.');
      }
      return productsApi.deleteProduct(id);
    },
    onSuccess: (data, productId) => {
      // Update the main products list
      queryClient.setQueryData(['products'], (old: ProductsResponse | undefined) => {
        if (!old) return old;
        return {
          ...old,
          products: old.products.filter((product: Product) => product.id !== productId),
        };
      });
      
      // Update category-specific queries without invalidating (since we do optimistic updates)
      queryClient.setQueriesData(
        { predicate: (query) => query.queryKey[0] === 'products-by-category' },
        (old: ProductsResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            products: old.products.filter((product: Product) => product.id !== productId),
          };
        }
      );
    },
  });
};