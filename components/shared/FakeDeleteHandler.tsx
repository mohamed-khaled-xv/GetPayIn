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
        onOptimisticUpdate?.(id);
        
        deleteMutation.mutate(id, {
          onSuccess: (response: any) => {
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
            }
          },
          onError: (error: any) => {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: `Failed to delete ${itemName.toLowerCase()}`,
            });
          },
        });
      },
    });
  };
};