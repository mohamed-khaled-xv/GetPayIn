import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { resetAutoLockTimer } from '../../hooks/useAutoLockSimple';
import { Typography } from '../../styles/typography';
import { canDeleteProducts } from '../../utils/userPermissions';

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  stock: number;
  brand?: string;
  description?: string;
  rating?: number;
}

interface CategoryProductsCardProps {
  item: Product;
  user: any;
  onDelete: (id: number, title: string) => void;
}

export const CategoryProductsCard: React.FC<CategoryProductsCardProps> = ({ item, user, onDelete }) => {
  const handleDelete = () => {
    resetAutoLockTimer();
    onDelete(item.id, item.title);
  };

  return (
    <View style={styles.productCard}>
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.productPrice}>
          ${item.price?.toFixed(2)}
        </Text>
        {item.brand && (
          <Text style={styles.productBrand} numberOfLines={1}>
            {item.brand}
          </Text>
        )}
        {item.description && (
          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <View style={styles.productMeta}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#f59e0b" />
            <Text style={styles.productRating}>
              {item.rating?.toFixed(1) || 'N/A'}
            </Text>
          </View>
          <Text style={styles.productStock}>
            Stock: {item.stock || 0}
          </Text>
        </View>
      </View>
      {canDeleteProducts(user) && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={16} color="#ffffff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 6,
    flex: 1,
    maxWidth: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#f0f0f0',
  },
  productInfo: {
    padding: 12,
    flex: 1,
  },
  productTitle: {
    fontSize: 14,
    fontFamily: Typography.fontFamily.bold,
    color: '#1a1a1a',
    marginBottom: 6,
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 18,
    fontFamily: Typography.fontFamily.bold,
    color: '#007AFF',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 12,
    fontFamily: Typography.fontFamily.medium,
    color: '#666666',
    marginBottom: 6,
  },
  productDescription: {
    fontSize: 12,
    fontFamily: Typography.fontFamily.regular,
    color: '#4a5568',
    lineHeight: 16,
    marginBottom: 8,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productRating: {
    fontSize: 11,
    fontFamily: Typography.fontFamily.medium,
    color: '#f59e0b',
    marginLeft: 2,
  },
  productStock: {
    fontSize: 11,
    fontFamily: Typography.fontFamily.medium,
    color: '#059669',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});