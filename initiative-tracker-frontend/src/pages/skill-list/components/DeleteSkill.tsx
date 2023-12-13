import { Button, App } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import ConfirmationModal, {
  ConfirmationModalRef,
} from '../../../components/ConfirmationModal';
import {useDeleteSkillMutation} from "../../../services/skill";

export interface DeleteSkillProps {
  onClose: () => void;
  skillId: number;
}

const DeleteSkill = ({ onClose, skillId }: DeleteSkillProps) => {
  const modal = useRef<ConfirmationModalRef>();
  const { message } = App.useApp();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.skill.delete',
  });
    const [deleteSkill, { isLoading, isSuccess }] = useDeleteSkillMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success(t('messages.success'));
      modal.current?.close();
    }
  }, [isSuccess]);

  const handleOk = async () => {
    await deleteSkill({
      id: skillId,
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

export default DeleteSkill;
