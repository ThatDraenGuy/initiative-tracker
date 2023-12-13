import {App, Button, Input, Select, Space} from 'antd';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useGetCharactersQuery } from '../../../services/character';
import { useEffect, useRef } from 'react';
import AppController from '../../../components/AppController';
import RightModal, { RightModalRef } from '../../../components/RightModal';
import {useCreateSkillMutation} from "../../../services/skill";

export interface CreateSkillProps {
  onClose: () => void;
}

interface CreateSkillFormProps {
  name: string;
  abilityId: number;
}

const CreateSkill = ({ onClose }: CreateSkillProps) => {
  const modal = useRef<RightModalRef>();
  const { message } = App.useApp();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.skill.create',
  });
  const { t: commonT } = useTranslation();
  const [createSkill, { isLoading, isSuccess }] = useCreateSkillMutation();
  const { data: characters, isLoading: isCharactersLoading } =
      useGetCharactersQuery({});
  const { handleSubmit, control, reset } = useForm<CreateSkillFormProps>();

  useEffect(() => {
    reset({
      name: "",
      abilityId: 0
    });
  }, []);

  useEffect(() => {
    if (isSuccess) {
      message.success(t('messages.success'));
      modal.current?.close();
    }
  }, [isSuccess]);

  const characterOptions = characters?.items.map(character => ({
    label: character.statBlock.entityName,
    value: character.id,
  }));

  const onSubmit = async (data: CreateSkillFormProps) => {
    await createSkill({
      name: data.name,
      abilityId: data.abilityId
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
                      type="text"
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('placeholders.name')}
                  />
              )}
          />
          <AppController
              title={t('controls.abilityId')}
              control={control}
              name="abilityId"
              rules={{
                required: {
                  value: true,
                  message: commonT('errors.required'),
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                  <Select
                      mode="tags"
                      allowClear
                      style={{ width: '100%' }}
                      onChange={onChange}
                      onBlur={onBlur}
                      loading={isCharactersLoading}
                      options={characterOptions}
                      value={value}
                  />
              )}
          />
        </Space>
      </RightModal>
  );
};

export default CreateSkill;
