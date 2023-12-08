import {
  Button,
  Drawer,
  Form,
  Select,
  Space,
  Spin,
  message,
  theme,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useCreateCharacterMutation } from '../../../services/character';
import { Controller, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import Title from 'antd/lib/typography/Title';
import { useGetPlayersQuery } from '../../../services/player';

export interface CreateCharacterProps {
  open: boolean;
  onClose: () => void;
}

interface CreateCharacterFormProps {
  playerId?: number;
  statBlockId: number;
}

const CreateCharacter = ({ open, onClose }: CreateCharacterProps) => {
  const { token } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.battle.start',
  });
  const { t: commonT } = useTranslation();
  const { handleSubmit, control, reset } = useForm<CreateCharacterFormProps>();

  const [createCharacter, { isLoading, isSuccess }] =
    useCreateCharacterMutation();
  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

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
            <>
              <Title level={4} style={{ color: token.colorText }}>
                {t('controls.playerIds')}
              </Title>
              <Controller
                control={control}
                name="playerId"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <Form.Item
                    validateStatus={error ? 'error' : 'validating'}
                    help={error ? error.message : ''}
                  >
                    <Select
                      mode="tags"
                      allowClear
                      style={{ width: '100%' }}
                      onChange={onChange}
                      onBlur={onBlur}
                      loading={isPlayersLoading}
                      options={playerOptions}
                      value={value}
                    />
                  </Form.Item>
                )}
              />
            </>
          </Space>
        </Drawer>
      </Spin>
    </>
  );
};

export default CreateCharacter;
