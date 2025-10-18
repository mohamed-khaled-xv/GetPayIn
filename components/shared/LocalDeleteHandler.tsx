import Toast from 'react-native-toast-message';
import { showDeleteAlert } from './DeleteAlert';

export const createLocalDeleteHandler = (
  itemName: string = 'Item',
  onLocalDelete: (id: number) => void
) => {
  return (id: number, title: string) => {
    showDeleteAlert({
      itemName,
      itemTitle: title,
      onConfirm: () => {
        // Remove item from local state immediately
        onLocalDelete(id);
        
        // Show success toast
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `${itemName} deleted successfully`,
        });
      },
    });
  };
};