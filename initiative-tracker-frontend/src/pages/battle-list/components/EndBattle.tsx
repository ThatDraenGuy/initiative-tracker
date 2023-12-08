import { Button, Spin, message, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDeleteBattleMutation } from '../../../services/battle';
import { useEffect } from 'react';
import { Button, Spin, message, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDeleteBattleMutation } from '../../../services/battle';
import { useEffect } from 'react';

export interface EndBattleProps {
  open: boolean;
  onClose: () => void;
  battleId: number;
}

const EndBattle = ({ onClose, open, battleId }: EndBattleProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.battle.end',
  });
  const [deleteBattle, { isLoading, isSuccess }] = useDeleteBattleMutation();

  useEffect(() => {
    if (isSuccess) {
      messageApi.success(t('messages.success'));
      onClose();
    }
  }, [isSuccess]);
  useEffect(() => {
    if (isSuccess) {
      messageApi.success(t('messages.success'));
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

export default EndBattle;
