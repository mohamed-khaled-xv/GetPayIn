import Toast from 'react-native-toast-message';
import { showDeleteAlert } from './DeleteAlert';

export const createFakeDeleteHandler = (
  deleteMutation: any,
  itemName: string = 'Item',
  onOptimisticUpdate?: (id: number) => void,
  onSuccessCallback?: () => void
) => {
  return (id: number, title: string) => {
    showDeleteAlert({
      itemName,
      itemTitle: title,
      onConfirm: () => {
        // Immediately update UI optimistically
        onOptimisticUpdate?.(id);
        
        // Call the fake delete API
        deleteMutation.mutate(id, {
          onSuccess: (response: any) => {
            // Check if the fake deletion was successful
            if (response.isDeleted) {
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: `${itemName} deleted successfully`,
              });
              onSuccessCallback?.();
            } else {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: `Failed to delete ${itemName.toLowerCase()}`,
              });
              // Revert optimistic update if API call failed
              // (In a real app, you'd restore the item)
            }
          },
          onError: (error: any) => {
            console.error('Delete error:', error);
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: `Failed to delete ${itemName.toLowerCase()}`,
            });
            // Revert optimistic update on error
            // (In a real app, you'd restore the item)
          },
        });
      },
    });
  };
};