import { Button, Drawer, Select, Space, Spin, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCreateCharacterMutation } from '../../../services/character';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useGetPlayersQuery } from '../../../services/player';
import { useGetStatBlocksBriefQuery } from '../../../services/statBlock';
import AppController from '../../../components/AppController';

export interface CreateCharacterProps {
  open: boolean;
  onClose: () => void;
}

interface CreateCharacterFormProps {
  playerId?: number;
  statBlockId: number;
}

const CreateCharacter = ({ open, onClose }: CreateCharacterProps) => {
  const [messageApi, contextHolder] = message.useMessage();
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
      messageApi.success(t('messages.success'));
      onClose();
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
    <>
      {contextHolder}
      <Spin spinning={isLoading}>
        <Drawer
          width="40%"
          placement="right"
          title={t('title')}
          open={open}
          onClose={onClose}
          extra={
            <Space>
              <Button onClick={onClose}>{commonT('buttons.cancel')}</Button>
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
        </Drawer>
      </Spin>
    </>
  );
};

export default CreateCharacter;
