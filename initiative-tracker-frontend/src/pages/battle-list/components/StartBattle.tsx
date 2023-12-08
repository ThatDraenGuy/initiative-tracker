import { Button, Drawer, Select, Space, Spin, message } from 'antd';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useStartBattleMutation } from '../../../services/battle';
import { useGetCharactersQuery } from '../../../services/character';
import { useEffect } from 'react';
import AppController from '../../../components/AppController';

export interface StartBattleProps {
  open: boolean;
  onClose: () => void;
}

interface StartBattleFormProps {
  characterIds: number[];
}

const StartBattle = ({ onClose, open }: StartBattleProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.battle.start',
  });
  const { t: commonT } = useTranslation();
  const [startBattle, { isLoading, isSuccess }] = useStartBattleMutation();
  const { data: characters, isLoading: isCharactersLoading } =
    useGetCharactersQuery({});
  const { handleSubmit, control, reset } = useForm<StartBattleFormProps>();

  useEffect(() => {
    reset({
      characterIds: [],
    });
  }, []);

  useEffect(() => {
    if (isSuccess) {
      messageApi.success(t('messages.success'));
      onClose();
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
        </Drawer>
      </Spin>
    </>
  );
};

export default StartBattle;
