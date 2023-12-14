import { useEffect, useRef } from 'react';
import { InitiativeEntry, useHealMutation } from '../../../../services/battle';
import RightModal, { RightModalRef } from '../../../../components/RightModal';
import { App, Button, InputNumber, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import AppController from '../../../../components/AppController';

export interface HealCharacterProps {
  onClose: () => void;
  entry: InitiativeEntry;
}

interface HealCharacterFormProps {
  amount: number;
}

const HealCharacter = ({ onClose, entry }: HealCharacterProps) => {
  const modal = useRef<RightModalRef>();
  const { message } = App.useApp();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.battle.initiative.heal',
  });
  const { t: commonT } = useTranslation();

  const [heal, { isLoading, isSuccess }] = useHealMutation();
  const { handleSubmit, control, reset } = useForm<HealCharacterFormProps>();

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      message.success(t('messages.success'));
      modal.current?.close();
    }
  }, [isSuccess]);

  const onSubmit = async (data: HealCharacterFormProps) => {
    await heal({
      id: entry.currentStats.id,
      heal: {
        ...data,
      },
    });
  };

  return (
    <RightModal
      ref={modal}
      title={t('title')}
      onClose={onClose}
      isLoading={isLoading}
      extra={
        <Space>
          <Button onClick={modal.current?.close}>
            {commonT('buttons.cancel')}
          </Button>
          <Button type="primary" onClick={handleSubmit(onSubmit)}>
            {commonT('buttons.save')}
          </Button>
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <AppController
          title={t('controls.amount')}
          control={control}
          name="amount"
          rules={{
            required: {
              value: true,
              message: commonT('errors.required'),
            },
            min: {
              value: 1,
              message: commonT('errors.outOfRange'),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputNumber onChange={onChange} onBlur={onBlur} value={value} />
          )}
        />
      </Space>
    </RightModal>
  );
};

export default HealCharacter;
