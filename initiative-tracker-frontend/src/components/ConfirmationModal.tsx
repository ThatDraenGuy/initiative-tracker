import { Modal, ModalProps, Spin } from 'antd';

export interface ConfirmationModalProps extends ModalProps {
  isLoading?: boolean;
}

const ConfirmationModal = (props: ConfirmationModalProps) => {
  return (
    <Spin spinning={props.isLoading}>
      <Modal {...props} open>
        {props.children}
      </Modal>
    </Spin>
  );
};

export default ConfirmationModal;
