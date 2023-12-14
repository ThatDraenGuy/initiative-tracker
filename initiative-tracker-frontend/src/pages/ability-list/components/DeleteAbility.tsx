import { Button, App } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import ConfirmationModal, {
  ConfirmationModalRef,
} from '../../../components/ConfirmationModal';
import { useDeleteAbilityMutation } from '../../../services/ability';

export interface DeleteabilityProps {
  onClose: () => void;
  abilityId: number;
}

const Deleteability = ({ onClose, abilityId }: DeleteabilityProps) => {
  const modal = useRef<ConfirmationModalRef>();
  const { message } = App.useApp();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.ability.delete',
  });
  const [deleteability, { isLoading, isSuccess }] = useDeleteAbilityMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success(t('messages.success'));
      modal.current?.close();
    }
  }, [isSuccess]);

  const handleOk = async () => {
    await deleteability({
      id: abilityId,
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

export default Deleteability;
