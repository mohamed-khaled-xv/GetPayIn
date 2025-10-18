import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';

export const showNativeDeleteAlert = (itemName: string, itemTitle: string, onConfirm: () => void) => {
  Alert.alert(
    `Delete ${itemName}`,
    `Are you sure you want to delete "${itemTitle}"?`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: onConfirm,
      },
    ]
  );
};

export const createNativeOptimisticDeleteHandler = (
  deleteMutation: any,
  itemName: string = 'Item',
  onOptimisticUpdate?: (id: number) => void,
  onSuccessCallback?: () => void
) => {
  return (id: number, title: string) => {
    showNativeDeleteAlert(itemName, title, () => {
      // Immediately update UI optimistically
      onOptimisticUpdate?.(id);
      
      deleteMutation.mutate(id, {
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: `${itemName} deleted successfully`,
          });
          onSuccessCallback?.();
        },
        onError: (error: any) => {
          console.error('Delete error:', error);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: `Failed to delete ${itemName.toLowerCase()}`,
          });
        },
      });
    });
  };
};