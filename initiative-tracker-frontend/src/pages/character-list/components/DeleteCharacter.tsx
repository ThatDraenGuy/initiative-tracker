import { useEffect, useRef } from 'react';
import ConfirmationModal, {
  ConfirmationModalRef,
} from '../../../components/ConfirmationModal';
import { App, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDeleteCharacterMutation } from '../../../services/character';

export interface DeleteCharacterProps {
  characterId: number;
  onClose: () => void;
}

const DeleteCharacter = ({ characterId, onClose }: DeleteCharacterProps) => {
  const modal = useRef<ConfirmationModalRef>();
  const { message } = App.useApp();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.character.delete',
  });
  const [deleteCharacter, { isLoading, isSuccess }] =
    useDeleteCharacterMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success(t('messages.success'));
      modal.current?.close();
    }
  }, [isSuccess]);

  const handleOk = async () => {
    await deleteCharacter({
      id: characterId,
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

export default DeleteCharacter;
