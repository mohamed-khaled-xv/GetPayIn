import Toast from 'react-native-toast-message';

interface DeleteAlertOptions {
  itemName: string;
  itemTitle: string;
  onConfirm: () => void;
}

export let showCustomDeleteAlert: ((options: DeleteAlertOptions) => void) | null = null;

export const setDeleteAlertHandler = (handler: (options: DeleteAlertOptions) => void) => {
  showCustomDeleteAlert = handler;
};

export const showDeleteAlert = (options: DeleteAlertOptions) => {
  if (showCustomDeleteAlert) {
    showCustomDeleteAlert(options);
  } else {
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