import { Button, Spin, message, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useDeletePlayerMutation } from '../../../services/player';

export interface DeletePlayerProps {
  open: boolean;
  onClose: () => void;
  playerId: number;
}

interface PlayerDeleteFormProps {
  id: number;
}

const DeletePlayer = ({ onClose, open, playerId }: DeletePlayerProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.player.delete',
  });
  const [deletePlayer, { isLoading, isSuccess }] = useDeletePlayerMutation();

  useEffect(() => {
    if (isSuccess) {
      messageApi.success(t('messages.success'));
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
    <>
      {contextHolder}
      <Spin spinning={isLoading}>
        <Modal
          title={t('title')}
          open={open}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="submit" onClick={handleOk}>
              {t('buttons.delete')}
            </Button>,
            <Button key="back" type="primary" onClick={handleCancel}>
              {t('buttons.cancel')}
            </Button>,
          ]}
        >
          <p>{t('warning')}</p>
        </Modal>
      </Spin>
    </>
  );
};

export default DeletePlayer;
