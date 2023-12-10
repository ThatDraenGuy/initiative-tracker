import { Button, App } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDeleteBattleMutation } from '../../../services/battle';
import { useEffect } from 'react';
import ConfirmationModal from '../../../components/ConfirmationModal';

export interface EndBattleProps {
  onClose: () => void;
  battleId: number;
}

const EndBattle = ({ onClose, battleId }: EndBattleProps) => {
  const { message } = App.useApp();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.battle.end',
  });
  const [deleteBattle, { isLoading, isSuccess }] = useDeleteBattleMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success(t('messages.success'));
      onClose();
    }
  }, [isSuccess]);

  const handleOk = async () => {
    await deleteBattle({
      battleId: battleId,
    });
    onClose();
  };

  const handleCancel = async () => {
    onClose();
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

export default EndBattle;
