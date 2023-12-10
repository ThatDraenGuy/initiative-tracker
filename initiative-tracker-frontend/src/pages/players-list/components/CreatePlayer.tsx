import { Button, Drawer, Space, Spin, message } from 'antd';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import AppController from '../../../components/AppController';
import { useCreatePlayerMutation } from '../../../services/player';
import { UserOutlined } from '@ant-design/icons';
import { Input } from 'antd';

export interface CreatePlayerProps {
  open: boolean;
  onClose: () => void;
}

interface CreatePlayerFormProps {
  name: string;
}

const CreatePlayer = ({ onClose, open }: CreatePlayerProps) => {
  const [messageApi, contextHolder] = message.useMessage();
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
      messageApi.success(t('messages.success'));
      onClose();
    }
  }, [isSuccess]);

  const onSubmit = async (data: CreatePlayerFormProps) => {
    await createPlayer({
      name: data.name,
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
        </Drawer>
      </Spin>
    </>
  );
};

export default CreatePlayer;
