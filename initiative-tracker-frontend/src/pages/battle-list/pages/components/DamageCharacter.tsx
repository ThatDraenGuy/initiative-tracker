import { useEffect, useRef } from 'react';
import {
  InitiativeEntry,
  useDamageMutation,
} from '../../../../services/battle';
import RightModal, { RightModalRef } from '../../../../components/RightModal';
import { App, Button, InputNumber, Select, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import AppController from '../../../../components/AppController';
import { useGetDamageTypesQuery } from '../../../../services/damageType';

export interface DamageCharacterProps {
  onClose: () => void;
  entry: InitiativeEntry;
}

interface DamageCharacterFormProps {
  amount: number;
  damageTypeId?: number;
}

const DamageCharacter = ({ onClose, entry }: DamageCharacterProps) => {
  const modal = useRef<RightModalRef>();
  const { message } = App.useApp();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.battle.initiative.damage',
  });
  const { t: commonT } = useTranslation();

  const [damage, { isLoading, isSuccess }] = useDamageMutation();
  const { data: damageTypes, isLoading: isDamageTypesLoading } =
    useGetDamageTypesQuery({});
  const { handleSubmit, control, reset } = useForm<DamageCharacterFormProps>();

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      message.success(t('messages.success'));
      modal.current?.close();
    }
  }, [isSuccess]);

  const damageTypeOptions =
    damageTypes?.items.map(damageType => ({
      label: damageType.name,
      value: damageType.id,
    })) ?? [];

  const onSubmit = async (data: DamageCharacterFormProps) => {
    await damage({
      id: entry.currentStats.id,
      damage: {
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
        <AppController
          title={t('controls.damageTypeId')}
          control={control}
          name="damageTypeId"
          rules={{}}
          render={({ field: { onChange, onBlur, value } }) => (
            <Select
              style={{ width: '100%' }}
              onChange={onChange}
              onBlur={onBlur}
              loading={isDamageTypesLoading}
              options={damageTypeOptions}
              value={value}
            />
          )}
        />
      </Space>
    </RightModal>
  );
};

export default DamageCharacter;
