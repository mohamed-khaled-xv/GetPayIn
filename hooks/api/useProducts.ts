import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Product, ProductsResponse, productsApi } from '../../services/api';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAllProducts,
    staleTime: 1000 * 60 * 5, 
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: productsApi.getCategories,
    staleTime: 1000 * 60 * 30, 
  });
};

export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['products-by-category', category],
    queryFn: () => productsApi.getProductsByCategory(category),
    enabled: !!category,
    staleTime: 1000 * 60 * 5, 
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => productsApi.deleteProduct(id),
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