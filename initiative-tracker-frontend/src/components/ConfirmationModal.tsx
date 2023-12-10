import { Modal, ModalProps, Spin } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';

export interface ConfirmationModalRef {
  close: () => void;
}

export interface ConfirmationModalProps extends ModalProps {
  isLoading?: boolean;
  onClose?: () => void;
}

const ConfirmationModal = forwardRef((props: ConfirmationModalProps, ref) => {
  const [open, setOpen] = useState(true);

  useImperativeHandle(ref, () => ({
    close() {
      setOpen(false);
    },
  }));
  return (
    <Spin spinning={props.isLoading}>
      <Modal
        {...props}
        open={open}
        onCancel={props.onCancel ? props.onCancel : () => setOpen(false)}
        afterOpenChange={(open: boolean) => {
          if (!open && props.onClose) {
            props.onClose();
          }
        }}
      >
        {props.children}
      </Modal>
    </Spin>
  );
});

export default ConfirmationModal;
