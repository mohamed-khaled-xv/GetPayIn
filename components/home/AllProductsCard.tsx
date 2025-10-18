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
  category?: string;
}

interface AllProductsCardProps {
  item: Product;
  user: any;
  onDelete: (id: number, title: string) => void;
}

export const AllProductsCard: React.FC<AllProductsCardProps> = ({ item, user, onDelete }) => {
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
        <View style={styles.productMeta}>
          <Text style={styles.productStock}>
            Stock: {item.stock || 0}
          </Text>
          {item.category && (
            <Text style={styles.productCategory} numberOfLines={1}>
              {item.category}
            </Text>
          )}
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
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  productInfo: {
    padding: 12,
    flex: 1,
  },
  productTitle: {
    fontSize: 14,
    fontFamily: Typography.fontFamily.semiBold,
    color: '#1a1a1a',
    marginBottom: 6,
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 16,
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
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  productStock: {
    fontSize: 11,
    fontFamily: Typography.fontFamily.regular,
    color: '#059669',
  },
  productCategory: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.regular,
    color: '#666666',
    textTransform: 'capitalize',
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