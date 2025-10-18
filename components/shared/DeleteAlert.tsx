import Toast from 'react-native-toast-message';

interface DeleteAlertOptions {
  itemName: string;
  itemTitle: string;
  onConfirm: () => void;
}

// This will be used with a global alert state or context
export let showCustomDeleteAlert: ((options: DeleteAlertOptions) => void) | null = null;

export const setDeleteAlertHandler = (handler: (options: DeleteAlertOptions) => void) => {
  showCustomDeleteAlert = handler;
};

export const showDeleteAlert = (options: DeleteAlertOptions) => {
  if (showCustomDeleteAlert) {
    showCustomDeleteAlert(options);
  } else {
    // Fallback: execute immediately if handler not ready
    console.warn('Alert handler not initialized, executing delete immediately');
    options.onConfirm();
  }
};


export const createDeleteHandler = (
  deleteMutation: any,
  itemName: string = 'Item',
  onSuccessCallback?: () => void
) => {
  return (id: number, title: string) => {
    showDeleteAlert({
      itemName,
      itemTitle: title,
      onConfirm: () => {
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
      },
    });
  };
};


export const createOptimisticDeleteHandler = (
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
            // On error, we might want to revert the optimistic update
            // This would require additional logic to restore the item
          },
        });
      },
    });
  };
};