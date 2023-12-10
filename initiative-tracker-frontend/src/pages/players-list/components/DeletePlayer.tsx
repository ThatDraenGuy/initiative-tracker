import { Button, App } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import { useDeletePlayerMutation } from '../../../services/player';
import ConfirmationModal, {
  ConfirmationModalRef,
} from '../../../components/ConfirmationModal';

export interface DeletePlayerProps {
  onClose: () => void;
  playerId: number;
}

interface PlayerDeleteFormProps {
  id: number;
}

const DeletePlayer = ({ onClose, playerId }: DeletePlayerProps) => {
  const modal = useRef<ConfirmationModalRef>();
  const { message } = App.useApp();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.player.delete',
  });
  const [deletePlayer, { isLoading, isSuccess }] = useDeletePlayerMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success(t('messages.success'));
      modal.current?.close();
    }
  }, [isSuccess]);

  const handleOk = async () => {
    await onSubmit({
      id: playerId,
    });
  };

  const onSubmit = async (data: PlayerDeleteFormProps) => {
    await deletePlayer({
      id: data.id,
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

export default DeletePlayer;
