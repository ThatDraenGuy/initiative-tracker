import { Button, App } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useDeletePlayerMutation } from '../../../services/player';
import ConfirmationModal from '../../../components/ConfirmationModal';

export interface DeletePlayerProps {
  onClose: () => void;
  playerId: number;
}

interface PlayerDeleteFormProps {
  id: number;
}

const DeletePlayer = ({ onClose, playerId }: DeletePlayerProps) => {
  const { message } = App.useApp();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.player.delete',
  });
  const [deletePlayer, { isLoading, isSuccess }] = useDeletePlayerMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success(t('messages.success'));
      onClose();
    }
  }, [isSuccess]);

  const handleOk = async () => {
    await onSubmit({
      id: playerId,
    });
    onClose();
  };

  const handleCancel = async () => {
    onClose();
  };
  const onSubmit = async (data: PlayerDeleteFormProps) => {
    await deletePlayer({
      id: data.id,
    });
  };

  return (
    <ConfirmationModal
      title={t('title')}
      onOk={handleOk}
      onCancel={handleCancel}
      isLoading={isLoading}
      footer={[
        <Button key="submit" type="primary" onClick={handleOk}>
          {t('buttons.delete')}
        </Button>,
        <Button key="back" onClick={handleCancel}>
          {t('buttons.cancel')}
        </Button>,
      ]}
    >
      <p>{t('warning')}</p>
    </ConfirmationModal>
  );
};

export default DeletePlayer;
