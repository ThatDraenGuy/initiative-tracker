import { Button, Space, App } from 'antd';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import AppController from '../../../components/AppController';
import { useCreatePlayerMutation } from '../../../services/player';
import { UserOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import RightModal, { RightModalRef } from '../../../components/RightModal';

export interface CreatePlayerProps {
  onClose: () => void;
}

interface CreatePlayerFormProps {
  name: string;
}

const CreatePlayer = ({ onClose }: CreatePlayerProps) => {
  const modal = useRef<RightModalRef>();
  const { message } = App.useApp();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.player.create',
  });
  const { t: commonT } = useTranslation();
  const [createPlayer, { isLoading, isSuccess }] = useCreatePlayerMutation();
  const { handleSubmit, control, reset } = useForm<CreatePlayerFormProps>();

  useEffect(() => {
    reset({
      name: undefined,
    });
  }, []);

  useEffect(() => {
    if (isSuccess) {
      message.success(t('messages.success'));
      modal.current?.close();
    }
  }, [isSuccess]);

  const onSubmit = async (data: CreatePlayerFormProps) => {
    await createPlayer({
      name: data.name,
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
