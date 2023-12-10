import { Drawer, DrawerProps, Spin } from 'antd';

export interface RightModalProps extends DrawerProps {
  isLoading?: boolean;
}

const RightModal = (props: RightModalProps) => {
  return (
    <Spin spinning={props.isLoading}>
      <Drawer {...props} width="40%" placement="right" open>
        {props.children}
      </Drawer>
    </Spin>
  );
};

export default RightModal;
