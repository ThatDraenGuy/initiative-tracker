import { Button, Space, App } from 'antd';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import AppController from '../../../components/AppController';
import { useCreatePlayerMutation } from '../../../services/player';
import { UserOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import RightModal from '../../../components/RightModal';

export interface CreatePlayerProps {
  onClose: () => void;
}

interface CreatePlayerFormProps {
  name: string;
}

const CreatePlayer = ({ onClose }: CreatePlayerProps) => {
  const { message } = App.useApp();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.player.create',
  });
  const { t: commonT } = useTranslation();
  const [createPlayer, { isLoading, isSuccess }] = useCreatePlayerMutation();
  const { handleSubmit, control, reset } = useForm<CreatePlayerFormProps>();

  useEffect(() => {
    reset({
      name: '',
    });
  }, []);

  useEffect(() => {
    if (isSuccess) {
      message.success(t('messages.success'));
      onClose();
    }
  }, [isSuccess]);

  const onSubmit = async (data: CreatePlayerFormProps) => {
    await createPlayer({
      name: data.name,
    });
  };

  return (
    <RightModal
      title={t('title')}
      onClose={onClose}
      isLoading={isLoading}
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
          title={t('controls.name')}
          control={control}
          name="name"
          rules={{
            required: {
              value: true,
              message: commonT('errors.required'),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={t('name.placeholder')}
              prefix={<UserOutlined />}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
      </Space>
    </RightModal>
  );
};

export default CreatePlayer;
