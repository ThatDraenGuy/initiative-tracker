import {Button, Spin, message, Modal} from 'antd';
import {useTranslation} from 'react-i18next';
import {useDeleteBattleMutation} from '../../../services/battle';
import {useEffect} from "react";

export interface DeleteCharacterProps {
    open: boolean;
    onClose: () => void;
    characterId: number;
}

interface CharacterDeleteFormProps {
    characterId: number;
}

const EndBattle = ({onClose, open, characterId}: DeleteCharacterProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const {t} = useTranslation('translation', {
        keyPrefix: 'pages.battle.end',
    });
    const [deleteCharacter, {isLoading, isSuccess}] = useDeleteBattleMutation();

    useEffect(() => {
        if (isSuccess) {
            messageApi.success(t('messages.success'));
            onClose();
        }
    }, [isSuccess]);

    const handleOk = async () => {
        await onSubmit({
            characterId: characterId,
        })
        onClose()
    };

    const handleCancel = async () => {
        onClose()
    };
    const onSubmit = async (data: CharacterDeleteFormProps) => {
        await deleteCharacter({
            characterId: data.characterId,
        });
    };

    return (
        <>
            {contextHolder}
            <Spin spinning={isLoading}>
                <Modal title={t('title')} open={open} onOk={handleOk} onCancel={handleCancel}
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