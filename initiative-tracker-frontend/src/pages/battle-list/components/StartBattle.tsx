import { App, Button, Select, Space } from 'antd';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useStartBattleMutation } from '../../../services/battle';
import { useGetCharactersBriefQuery } from '../../../services/character';
import { useEffect, useRef } from 'react';
import AppController from '../../../components/AppController';
import RightModal, { RightModalRef } from '../../../components/RightModal';

export interface StartBattleProps {
  onClose: () => void;
}

interface StartBattleFormProps {
  characterIds: number[];
}

const StartBattle = ({ onClose }: StartBattleProps) => {
  const modal = useRef<RightModalRef>();
  const { message } = App.useApp();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.battle.start',
  });
  const { t: commonT } = useTranslation();
  const [startBattle, { isLoading, isSuccess }] = useStartBattleMutation();
  const { data: characters, isLoading: isCharactersLoading } =
    useGetCharactersBriefQuery({});
  const { handleSubmit, control, reset } = useForm<StartBattleFormProps>();

  useEffect(() => {
    reset({
      characterIds: [],
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

  const onSubmit = async (data: StartBattleFormProps) => {
    await startBattle({
      characterIds: data.characterIds,
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
          title={t('controls.characterIds')}
          control={control}
          name="characterIds"
          rules={{
            required: {
              value: true,
              message: commonT('errors.required'),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Select
              mode="multiple"
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

export default StartBattle;
