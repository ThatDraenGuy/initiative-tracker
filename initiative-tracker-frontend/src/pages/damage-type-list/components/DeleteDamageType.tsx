import { Button, App } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import { useDeleteDamageTypeMutation } from '../../../services/damageType';
import ConfirmationModal, {
  ConfirmationModalRef,
} from '../../../components/ConfirmationModal';

export interface DeleteDamageTypeProps {
  onClose: () => void;
  damageTypeId: number;
}

const DeleteDamageType = ({ onClose, damageTypeId }: DeleteDamageTypeProps) => {
  const modal = useRef<ConfirmationModalRef>();
  const { message } = App.useApp();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.damageType.delete',
  });
  const [deleteDamageType, { isLoading, isSuccess }] = useDeleteDamageTypeMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success(t('messages.success'));
      modal.current?.close();
    }
  }, [isSuccess]);

  const handleOk = async () => {
    await deleteDamageType({
      id: damageTypeId,
    });
  };

  return (
    <ConfirmationModal
      ref={modal}
      title={t('title')}
      onOk={handleOk}
      onClose={onClose}
      isLoading={isLoading}
      footer={[
        <Button key="submit" type="primary" onClick={handleOk}>
          {t('buttons.delete')}
        </Button>,
        <Button key="back" onClick={modal.current?.close}>
          {t('buttons.cancel')}
        </Button>,
      ]}
    >
      <p>{t('warning')}</p>
    </ConfirmationModal>
  );
};

export default DeleteDamageType;
