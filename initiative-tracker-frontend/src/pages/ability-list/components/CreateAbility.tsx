import { Button, Space, App } from 'antd';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import AppController from '../../../components/AppController';
import { UserOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import RightModal, { RightModalRef } from '../../../components/RightModal';
import {useCreateAbilityMutation} from "../../../services/ability";

export interface CreateAbilityProps {
  onClose: () => void;
}

interface CreateAbilityFormProps {
  name: string;
}

const CreateAbility = ({ onClose }: CreateAbilityProps) => {
  const modal = useRef<RightModalRef>();
  const { message } = App.useApp();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.ability.create',
  });
  const { t: commonT } = useTranslation();
  const [createAbility, { isLoading, isSuccess }] = useCreateAbilityMutation();
  const { handleSubmit, control, reset } = useForm<CreateAbilityFormProps>();

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

  const onSubmit = async (data: CreateAbilityFormProps) => {
    await createAbility({
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

export default CreateAbility;
