import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';

export const createTestDeleteHandler = (
  deleteMutation: any,
  itemName: string = 'Item',
  onOptimisticUpdate?: (id: number) => void,
  onSuccessCallback?: () => void
) => {
  return (id: number, title: string) => {
    console.log('DELETE HANDLER CALLED:', { id, title, itemName });
    
    Alert.alert(
      `Delete ${itemName}`,
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('DELETE CONFIRMED:', id);
            
            // Immediately update UI optimistically
            console.log('CALLING OPTIMISTIC UPDATE');
            onOptimisticUpdate?.(id);
            
            // Call the fake delete API
            console.log('CALLING DELETE MUTATION');
            deleteMutation.mutate(id, {
              onSuccess: (response: any) => {
                console.log('DELETE SUCCESS:', response);
                // Check if the fake deletion was successful
                if (response?.isDeleted || response) {
                  Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: `${itemName} deleted successfully`,
                  });
                  onSuccessCallback?.();
                } else {
                  console.log('DELETE RESPONSE NOT SUCCESSFUL:', response);
                  Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: `Failed to delete ${itemName.toLowerCase()}`,
                  });
                }
              },
              onError: (error: any) => {
                console.error('DELETE ERROR:', error);
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: `Failed to delete ${itemName.toLowerCase()}`,
                });
              },
            });
          },
        },
      ]
    );
  };
};