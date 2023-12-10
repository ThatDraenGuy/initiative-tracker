import { Button, App } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDeleteBattleMutation } from '../../../services/battle';
import { useEffect, useRef } from 'react';
import ConfirmationModal, {
  ConfirmationModalRef,
} from '../../../components/ConfirmationModal';

export interface EndBattleProps {
  onClose: () => void;
  battleId: number;
}

const EndBattle = ({ onClose, battleId }: EndBattleProps) => {
  const modal = useRef<ConfirmationModalRef>();
  const { message } = App.useApp();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.battle.end',
  });
  const [deleteBattle, { isLoading, isSuccess }] = useDeleteBattleMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success(t('messages.success'));
      modal.current?.close();
    }
  }, [isSuccess]);

  const handleOk = async () => {
    await deleteBattle({
      id: battleId,
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

export default EndBattle;
