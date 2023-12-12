import { useEffect, useRef } from 'react';
import RightModal, { RightModalRef } from '../../../components/RightModal';
import { useTranslation } from 'react-i18next';
import {
  App,
  Button,
  Col,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Table,
} from 'antd';
import { useForm } from 'react-hook-form';
import { useCreateStatBlockMutation } from '../../../services/statBlock';
import AppController from '../../../components/AppController';
import { useGetCreatureTypesQuery } from '../../../services/creatureType';
import { useGetSkillsQuery } from '../../../services/skill';
import { useGetAbilitiesQuery } from '../../../services/ability';
import { editArrElem, getBonusFromScore } from '../../../utils';
import { useGetDamageTypesQuery } from '../../../services/damageType';

export interface CreateStatBlockProps {
  onClose: () => void;
}

interface AbilityScoreForm {
  abilityId: number;
  score: number;
}
interface DamageTypeModifierForm {
  damageTypeId: number;
  modifier: number;
}

interface CreateStatBlockFormProps {
  entityName: string;
  hitPoints: number;
  hitDiceType?: number;
  hitDiceCount?: number;
  armorClass: number;
  speed: number;
  level: number;
  creatureTypeId: number;
  abilityScores: AbilityScoreForm[];
  proficientSkillIds: number[];
  damageTypeModifiers: DamageTypeModifierForm[];
}

const CreateStatBlock = ({ onClose }: CreateStatBlockProps) => {
  const modal = useRef<RightModalRef>();
  const { message } = App.useApp();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.statBlock.createStatBlock',
  });
  const { t: commonT } = useTranslation();
  const { handleSubmit, control, reset, watch } =
    useForm<CreateStatBlockFormProps>();
  const abilityScores = watch('abilityScores');
  const damageTypeModifiers = watch('damageTypeModifiers');
  // console.log(abilityScores);
  const [createStatBlock, { isLoading, isSuccess }] =
    useCreateStatBlockMutation();
  const { data: creatureTypes, isLoading: isCreatureTypesLoading } =
    useGetCreatureTypesQuery({});
  const { data: skills, isLoading: isSkillsLoading } = useGetSkillsQuery({});
  const { data: abilities, isLoading: isAbilitiesLoading } =
    useGetAbilitiesQuery({});
  const { data: damageTypes, isLoading: isDamageTypesLoading } =
    useGetDamageTypesQuery({});

  useEffect(() => {
    reset({
      abilityScores:
        abilities?.items.map(ability => ({
          abilityId: ability.id,
          score: 10,
        })) ?? [],
      damageTypeModifiers:
        damageTypes?.items.map(damageType => ({
          damageTypeId: damageType.id,
          modifier: 1,
        })) ?? [],
    });
  }, [abilities]);

  useEffect(() => {
    if (isSuccess) {
      message.success(t('messages.success'));
      modal.current?.close();
    }
  }, [isSuccess]);

  const creatureTypeOptions =
    creatureTypes?.items.map(creatureType => ({
      label: creatureType.name,
      value: creatureType.id,
    })) ?? [];

  const skillOptions =
    skills?.items.map(skill => ({
      label: skill.name,
      value: skill.id,
    })) ?? [];

  const abilityColumns = (
    value: AbilityScoreForm[],
    onChange: (e: AbilityScoreForm[]) => void,
    onBlur: () => void,
  ) => [
    {
      title: t('ability.columns.name'),
      dataIndex: 'abilityName',
      key: 'abilityName',
    },
    {
      title: t('ability.columns.value'),
      dataIndex: 'abilityValue',
      key: 'abilityValue',
      render: (
        cellValue: string,
        record: AbilityScoreForm,
        rowIndex: number,
      ) => (
        <InputNumber
          onChange={(val: number) =>
            onChange(
              editArrElem(value, rowIndex, {
                abilityId: record.abilityId,
                score: val,
              }),
            )
          }
          onBlur={onBlur}
          value={cellValue}
        />
      ),
    },
    {
      title: t('ability.columns.bonus'),
      dataIndex: 'abilityBonus',
      key: 'abilityBonus',
      width: 100,
    },
  ];

  const abilityDataSource =
    abilityScores?.map(score => ({
      ...score,
      abilityName:
        abilities?.items.find(ability => ability.id === score.abilityId)
          ?.name ?? '',
      abilityValue: score.score,
      abilityBonus: getBonusFromScore(score.score),
    })) ?? [];

  const damageTypeModifiersColumns = (
    value: DamageTypeModifierForm[],
    onChange: (e: DamageTypeModifierForm[]) => void,
    onBlur: () => void,
  ) => [
    {
      title: t('damageTypeModifier.columns.name'),
      dataIndex: 'damageTypeName',
      key: 'damageTypeName',
      width: 150,
    },
    {
      title: t('damageTypeModifier.columns.modifier'),
      dataIndex: 'damageTypeModifier',
      key: 'damageTypeModifier',
      render: (
        cellValue: number,
        record: DamageTypeModifierForm,
        rowIndex: number,
      ) => (
        <Select
          onChange={(val: number) =>
            onChange(
              editArrElem(value, rowIndex, {
                damageTypeId: record.damageTypeId,
                modifier: val,
              }),
            )
          }
          onBlur={onBlur}
          value={cellValue}
          options={[
            {
              label: commonT('damageTypeModifier.immunity'),
              value: 0,
            },
            {
              label: commonT('damageTypeModifier.resistance'),
              value: 0.5,
            },
            {
              label: commonT('damageTypeModifier.none'),
              value: 1,
            },
            {
              label: commonT('damageTypeModifier.vulnerability'),
              value: 1.5,
            },
          ]}
        />
      ),
    },
  ];

  const damageTypeModifierDataSource = damageTypeModifiers?.map(mod => ({
    ...mod,
    damageTypeName:
      damageTypes?.items.find(type => type.id === mod.damageTypeId)?.name ?? '',
    damageTypeModifier: mod.modifier,
  }));

  const onSubmit = async (data: CreateStatBlockFormProps) => {
    await createStatBlock({
      entityName: data.entityName,
      hitPoints: data.hitPoints,
      armorClass: data.armorClass,
      speed: data.speed,
      level: data.level,
      creatureTypeId: data.creatureTypeId,
      abilityScores: data.abilityScores,
      proficientSkills: data.proficientSkillIds.map(id => ({ skillId: id })),
      damageTypeModifiers: data.damageTypeModifiers,
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
          title={t('controls.entityName')}
          control={control}
          name="entityName"
          rules={{
            required: {
              value: true,
              message: commonT('errors.required'),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={t('placeholders.entityName')}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <AppController
              title={t('controls.hitPoints')}
              control={control}
              name="hitPoints"
              rules={{
                required: {
                  value: true,
                  message: commonT('errors.required'),
                },
                min: {
                  value: 0,
                  message: commonT('errors.outOfRange'),
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputNumber
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
          </Col>
          <Col span={8}>
            <AppController
              title={t('controls.hitDiceType')}
              control={control}
              name="hitDiceType"
              rules={{}}
              render={({ field: { onChange, onBlur, value } }) => (
                <Select
                  allowClear
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  options={[6, 8, 10, 12].map(num => ({
                    label: num,
                    value: num,
                  }))}
                />
              )}
            />
          </Col>
          <Col span={8}>
            <AppController
              title={t('controls.hitDiceCount')}
              control={control}
              name="hitDiceCount"
              rules={{
                min: {
                  value: 0,
                  message: commonT('errors.outOfRange'),
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputNumber
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <AppController
              title={t('controls.armorClass')}
              control={control}
              name="armorClass"
              rules={{
                required: {
                  value: true,
                  message: commonT('errors.required'),
                },
                min: {
                  value: 0,
                  message: commonT('errors.outOfRange'),
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputNumber
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
          </Col>
          <Col span={8}>
            <AppController
              title={t('controls.speed')}
              control={control}
              name="speed"
              rules={{
                required: {
                  value: true,
                  message: commonT('errors.required'),
                },
                min: {
                  value: 0,
                  message: commonT('errors.outOfRange'),
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputNumber
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
          </Col>
          <Col span={8}>
            <AppController
              title={t('controls.level')}
              control={control}
              name="level"
              rules={{
                required: {
                  value: true,
                  message: commonT('errors.required'),
                },
                min: {
                  value: 0,
                  message: commonT('errors.outOfRange'),
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputNumber
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
          </Col>
        </Row>
        <AppController
          title={t('controls.creatureTypeId')}
          control={control}
          name="creatureTypeId"
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
              loading={isCreatureTypesLoading}
              options={creatureTypeOptions}
              value={value}
            />
          )}
        />
        <AppController
          title={t('controls.proficientSkillIds')}
          control={control}
          name="proficientSkillIds"
          rules={{
            required: {
              value: true,
              message: commonT('errors.required'),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Select
              allowClear
              mode="multiple"
              maxTagCount="responsive"
              style={{ width: '100%' }}
              onChange={onChange}
              onBlur={onBlur}
              loading={isSkillsLoading}
              options={skillOptions}
              value={value}
            />
          )}
        />
        <AppController
          title={t('controls.abilityScores')}
          control={control}
          name="abilityScores"
          rules={{
            required: {
              value: true,
              message: commonT('errors.required'),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Table
              columns={abilityColumns(value, onChange, onBlur)}
              dataSource={abilityDataSource}
              loading={isAbilitiesLoading}
              pagination={false}
              rowKey={'abilityId'}
            />
          )}
        />
        <AppController
          title={t('controls.damageTypeModifiers')}
          control={control}
          name="damageTypeModifiers"
          rules={{
            required: {
              value: true,
              message: commonT('errors.required'),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Table
              columns={damageTypeModifiersColumns(value, onChange, onBlur)}
              dataSource={damageTypeModifierDataSource}
              loading={isDamageTypesLoading}
              pagination={false}
              rowKey={'damageTypeId'}
            />
          )}
        />
      </Space>
    </RightModal>
  );
};

export default CreateStatBlock;
