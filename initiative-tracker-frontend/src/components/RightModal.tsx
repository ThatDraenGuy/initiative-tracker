import { Drawer, DrawerProps, Spin } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';

export interface RightModalRef {
  close: () => void;
}

export interface RightModalProps extends DrawerProps {
  isLoading?: boolean;
}

const RightModal = forwardRef((props: RightModalProps, ref) => {
  const [open, setOpen] = useState(true);

  useImperativeHandle(ref, () => ({
    close() {
      setOpen(false);
    },
  }));
  return (
    <Spin spinning={props.isLoading}>
      <Drawer
        {...props}
        width="40%"
        placement="right"
        open={open}
        onClose={() => setOpen(false)}
        afterOpenChange={(open: boolean) => {
          if (!open && props.onClose) {
            props.onClose({});
          }
        }}
      >
        {props.children}
      </Drawer>
    </Spin>
  );
});

export default RightModal;
