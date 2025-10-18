import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StatusBar, StyleSheet, View } from 'react-native';
import { createFakeDeleteHandler } from '../components/shared';
import { useDeleteProduct, useProducts } from '../hooks/api/useProducts';
import { resetAutoLockTimer } from '../hooks/useAutoLockSimple';
import { useAppSelector } from '../store';

import { AllProductsCard } from '../components/home';

export default function AllProductsScreen() {
  const { data, isFetching, refetch } = useProducts();
  const deleteProduct = useDeleteProduct();
  const user = useAppSelector((state) => state.auth.user);
  
  const [localProducts, setLocalProducts] = useState(data?.products ?? []);
  
  useEffect(() => {
    setLocalProducts(data?.products ?? []);
  }, [data?.products]);

  const handleOptimisticDelete = useCallback((id: number) => {
    setLocalProducts(prev => prev.filter(product => product.id !== id));
  }, []);

  const handleDelete = useMemo(() => 
    createFakeDeleteHandler(
      deleteProduct,
      'Product',
      handleOptimisticDelete,
      refetch
    ), [deleteProduct, handleOptimisticDelete, refetch]
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        <FlatList
          data={localProducts}
          keyExtractor={(item) => String(item.id)}
          onScroll={() => resetAutoLockTimer()}
          scrollEventThrottle={1000}
          refreshControl={
            <RefreshControl 
              refreshing={isFetching} 
              onRefresh={() => {
                resetAutoLockTimer();
                refetch();
              }}
              tintColor="#007AFF"
              colors={['#007AFF']}
            />
          }
          renderItem={({ item }) => (
            <AllProductsCard
              item={item}
              user={user}
              onDelete={handleDelete}
            />
          )}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContainer: {
    padding: 12,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },

});