import React, { useState } from 'react';
import { CustomDeleteAlert } from './CustomDeleteAlert';
import { setDeleteAlertHandler } from './DeleteAlert';

interface DeleteAlertOptions {
  itemName: string;
  itemTitle: string;
  onConfirm: () => void;
}

export const DeleteAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alertState, setAlertState] = useState<{
    isVisible: boolean;
    options: DeleteAlertOptions | null;
  }>({
    isVisible: false,
    options: null,
  });

  React.useEffect(() => {
    setDeleteAlertHandler((options: DeleteAlertOptions) => {
      setAlertState({
        isVisible: true,
        options,
      });
    });
  }, []);

  const handleConfirm = () => {
    if (alertState.options?.onConfirm) {
      alertState.options.onConfirm();
    }
    setAlertState({
      isVisible: false,
      options: null,
    });
  };

  const handleCancel = () => {
    setAlertState({
      isVisible: false,
      options: null,
    });
  };

  return (
    <>
      {children}
      {alertState.options && (
        <CustomDeleteAlert
          visible={alertState.isVisible}
          itemName={alertState.options.itemName}
          itemTitle={alertState.options.itemTitle}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};