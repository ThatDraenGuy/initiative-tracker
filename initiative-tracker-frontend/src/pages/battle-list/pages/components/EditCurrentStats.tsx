import { useEffect, useRef } from 'react';
import RightModal, { RightModalRef } from '../../../../components/RightModal';
import { App, Button, InputNumber, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import AppController from '../../../../components/AppController';
import { InitiativeEntry } from '../../../../services/initiativeEntry';
import { useUpdateCurrentStatsMutation } from '../../../../services/currentStats';

export interface EditCurrentStatsProps {
  onClose: () => void;
  entry: InitiativeEntry;
}

interface EditCurrentStatsFormProps {
  hitPoints?: number;
  tempHitPoints: number;
  hitDiceCount?: number;
  armorClass?: number;
  speed?: number;
}

const EditCurrentStats = ({ onClose, entry }: EditCurrentStatsProps) => {
  const modal = useRef<RightModalRef>();
  const { message } = App.useApp();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.battle.initiative.edit',
  });
  const { t: commonT } = useTranslation();

  const [updateCurrentStats, { isLoading, isSuccess }] =
    useUpdateCurrentStatsMutation();
  const { handleSubmit, control, reset } = useForm<EditCurrentStatsFormProps>();

  useEffect(() => {
    reset({
      ...entry.currentStats,
    });
  }, [entry]);

  useEffect(() => {
    if (isSuccess) {
      message.success(t('messages.success'));
      modal.current?.close();
    }
  }, [isSuccess]);

  const onSubmit = async (data: EditCurrentStatsFormProps) => {
    await updateCurrentStats({
      id: entry.currentStats.id,
      values: {
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
          title={t('controls.hitPoints')}
          control={control}
          name="hitPoints"
          rules={{
            required: {
              value: true,
              message: commonT('errors.required'),
            },
            min: {
              value: 0,
              message: commonT('errors.outOfRange'),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputNumber onChange={onChange} onBlur={onBlur} value={value} />
          )}
        />
        <AppController
          title={t('controls.tempHitPoints')}
          control={control}
          name="tempHitPoints"
          rules={{
            required: {
              value: true,
              message: commonT('errors.required'),
            },
            min: {
              value: 0,
              message: commonT('errors.outOfRange'),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputNumber onChange={onChange} onBlur={onBlur} value={value} />
          )}
        />
        <AppController
          title={t('controls.hitDiceCount')}
          control={control}
          name="hitDiceCount"
          rules={{
            required: {
              value: true,
              message: commonT('errors.required'),
            },
            min: {
              value: 0,
              message: commonT('errors.outOfRange'),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputNumber onChange={onChange} onBlur={onBlur} value={value} />
          )}
        />
        <AppController
          title={t('controls.armorClass')}
          control={control}
          name="armorClass"
          rules={{
            required: {
              value: true,
              message: commonT('errors.required'),
            },
            min: {
              value: 0,
              message: commonT('errors.outOfRange'),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputNumber onChange={onChange} onBlur={onBlur} value={value} />
          )}
        />
        <AppController
          title={t('controls.speed')}
          control={control}
          name="speed"
          rules={{
            required: {
              value: true,
              message: commonT('errors.required'),
            },
            min: {
              value: 0,
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

export default EditCurrentStats;
