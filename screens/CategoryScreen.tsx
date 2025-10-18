import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { CategoryProductsCard } from '../components/categories';
import { createFakeDeleteHandler } from '../components/shared';
import { useCategories, useDeleteProduct, useProductsByCategory } from '../hooks/api/useProducts';
import { resetAutoLockTimer } from '../hooks/useAutoLockSimple';
import { RootState } from '../store';
import { Typography } from '../styles/typography';

export default function CategoryScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: categories, isFetching: categoriesLoading, refetch: refetchCategories } = useCategories();
  const { data: products, isFetching: productsLoading, refetch: refetchProducts } = useProductsByCategory(selectedCategory || '');
  const deleteProduct = useDeleteProduct();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [localProducts, setLocalProducts] = useState(products?.products || []);
  
  useEffect(() => {
    setLocalProducts(products?.products || []);
  }, [products?.products]);

  const handleCategoryPress = (categorySlug: string) => {
    resetAutoLockTimer();
    setSelectedCategory(categorySlug);
  };

  const handleOptimisticDelete = useCallback((id: number) => {
    setLocalProducts(prev => prev.filter(product => product.id !== id));
  }, []);

  const handleDeleteProduct = useMemo(() => 
    createFakeDeleteHandler(
      deleteProduct,
      'Product',
      handleOptimisticDelete,
      refetchProducts
    ), [deleteProduct, handleOptimisticDelete, refetchProducts]
  );

  const renderCategoryButton = ({ item }: { item: { slug: string; name: string } }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.slug && styles.selectedCategoryButton
      ]}
      onPress={() => handleCategoryPress(item.slug)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === item.slug && styles.selectedCategoryButtonText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }: { item: any }) => (
    <CategoryProductsCard
      item={item}
      user={user}
      onDelete={handleDeleteProduct}
    />
  );

  const selectedCategoryName = categories?.find(cat => cat.slug === selectedCategory)?.name;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        <View style={styles.categoriesSection}>
          <FlatList
            data={categories ?? []}
            keyExtractor={(item) => item.slug}
            renderItem={renderCategoryButton}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
            onScroll={() => resetAutoLockTimer()}
            scrollEventThrottle={1000}
          />
        </View>

        {selectedCategory ? (
          <View style={styles.productsSection}>
            <View style={styles.productsSectionHeader}>
              <Text style={styles.productsSectionTitle}>
                {selectedCategoryName || 'Products'}
              </Text>
              <Text style={styles.productsCount}>
                {localProducts.length} products
              </Text>
            </View>
            <FlatList
              key={selectedCategory}
              data={localProducts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderProductItem}
              numColumns={2}
              columnWrapperStyle={styles.productRow}
              onScroll={() => resetAutoLockTimer()}
              scrollEventThrottle={1000}
              refreshControl={
                <RefreshControl 
                  refreshing={productsLoading} 
                  onRefresh={() => {
                    resetAutoLockTimer();
                    refetchProducts();
                  }}
                />
              }
              contentContainerStyle={styles.productsContainer}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                !productsLoading ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                      No products found in this category
                    </Text>
                  </View>
                ) : null
              }
            />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Select a category to view products
            </Text>
          </View>
        )}

        {categoriesLoading && (
          <RefreshControl 
            refreshing={categoriesLoading} 
            onRefresh={() => {
              resetAutoLockTimer();
              refetchCategories();
            }}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  categoriesSection: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: Typography.fontFamily.bold,
    color: '#1a1a1a',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedCategoryButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: Typography.fontFamily.medium,
    color: '#666666',
  },
  selectedCategoryButtonText: {
    color: '#ffffff',
    fontFamily: Typography.fontFamily.semiBold,
  },
  productsSection: {
    flex: 1,
  },
  productsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  productsSectionTitle: {
    fontSize: 18,
    fontFamily: Typography.fontFamily.bold,
    color: '#1a1a1a',
  },
  productsCount: {
    fontSize: 14,
    fontFamily: Typography.fontFamily.regular,
    color: '#666666',
  },
  productsContainer: {
    padding: 12,
  },
  productRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: Typography.fontFamily.regular,
    color: '#666666',
    textAlign: 'center',
  },
});