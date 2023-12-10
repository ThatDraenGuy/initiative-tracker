import { App, Button, Select, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCreateCharacterMutation } from '../../../services/character';
import { useForm } from 'react-hook-form';
import { useEffect, useRef } from 'react';
import { useGetPlayersQuery } from '../../../services/player';
import { useGetStatBlocksBriefQuery } from '../../../services/statBlock';
import AppController from '../../../components/AppController';
import RightModal, { RightModalRef } from '../../../components/RightModal';

export interface CreateCharacterProps {
  onClose: () => void;
}

interface CreateCharacterFormProps {
  playerId?: number;
  statBlockId: number;
}

const CreateCharacter = ({ onClose }: CreateCharacterProps) => {
  const modal = useRef<RightModalRef>();
  const { message } = App.useApp();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.character.create',
  });
  const { t: commonT } = useTranslation();
  const { handleSubmit, control, reset } = useForm<CreateCharacterFormProps>();

  const [createCharacter, { isLoading, isSuccess }] =
    useCreateCharacterMutation();
  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});
  const { data: statBlocks, isLoading: isStatBlocksLoading } =
    useGetStatBlocksBriefQuery({});

  useEffect(() => {
    reset({
      playerId: undefined,
      statBlockId: undefined,
    });
  }, []);

  useEffect(() => {
    if (isSuccess) {
      message.success(t('messages.success'));
      modal.current?.close();
    }
  }, [isSuccess]);

  const playerOptions = players?.items.map(player => ({
    label: player.name,
    value: player.id,
  }));
  const statBlockOptions = statBlocks?.items.map(statBlock => ({
    label: statBlock.entityName,
    value: statBlock.id,
  }));

  const onSubmit = async (data: CreateCharacterFormProps) => {
    await createCharacter({
      ...data,
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
            {commonT('buttons.create')}
          </Button>
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <AppController
          title={t('controls.playerId')}
          control={control}
          name="playerId"
          render={({ field: { onChange, onBlur, value } }) => (
            <Select
              allowClear
              style={{ width: '100%' }}
              onChange={onChange}
              onBlur={onBlur}
              loading={isPlayersLoading}
              options={playerOptions}
              value={value}
            />
          )}
        />
        <AppController
          title={t('controls.statBlockId')}
          control={control}
          name="statBlockId"
          rules={{
            required: {
              value: true,
              message: commonT('errors.required'),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Select
              allowClear
              style={{ width: '100%' }}
              onChange={onChange}
              onBlur={onBlur}
              loading={isStatBlocksLoading}
              options={statBlockOptions}
              value={value}
            />
          )}
        />
      </Space>
    </RightModal>
  );
};

export default CreateCharacter;
