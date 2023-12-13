import { Button, App } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import { useDeleteCreatureTypeMutation } from '../../../services/creatureType';
import ConfirmationModal, {
  ConfirmationModalRef,
} from '../../../components/ConfirmationModal';

export interface DeleteCreatureTypeProps {
  onClose: () => void;
  creatureTypeId: number;
}

const DeleteCreatureType = ({ onClose, creatureTypeId }: DeleteCreatureTypeProps) => {
  const modal = useRef<ConfirmationModalRef>();
  const { message } = App.useApp();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.creatureType.delete',
  });
  const [deleteCreatureType, { isLoading, isSuccess }] = useDeleteCreatureTypeMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success(t('messages.success'));
      modal.current?.close();
    }
  }, [isSuccess]);

  const handleOk = async () => {
    await deleteCreatureType({
      id: creatureTypeId,
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

export default DeleteCreatureType;
