import { Button, Drawer, Select, Space, Spin, message, theme } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { usePostStartBattleMutation } from '../../../services/battle';
import { useGetCharactersQuery } from '../../../services/character';
import Title from 'antd/lib/typography/Title';
import { useEffect } from 'react';

export interface StartBattleProps {
  open: boolean;
  onClose: () => void;
}

interface StartBattleFormProps {
  characterIds: number[];
}

const StartBattle = ({ onClose, open }: StartBattleProps) => {
  const { token } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.battle.start',
  });
  const { t: commonT } = useTranslation();
  const [startBattle, { isLoading, isSuccess }] = usePostStartBattleMutation();
  const { data: characters, isLoading: isCharactersLoading } =
    useGetCharactersQuery({});
  const { handleSubmit, control, reset } = useForm<StartBattleFormProps>();

  useEffect(() => {
    reset({
      characterIds: [],
    });
  }, []);

  const characterOptions = characters?.items.map(character => ({
    label: character.statBlock.entityName,
    value: character.id,
  }));

  const onSubmit = async (data: StartBattleFormProps) => {
    await startBattle({
      characterIds: data.characterIds,
    });

    if (isSuccess) {
      messageApi.success(t('messages.success'));
    }
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
                {t('controls.characterIds')}
              </Title>
              <Controller
                control={control}
                name="characterIds"
                rules={{
                  required: true,
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
                  ></Select>
                )}
              />
            </>
          </Space>
        </Drawer>
      </Spin>
    </>
  );
};

export default StartBattle;
