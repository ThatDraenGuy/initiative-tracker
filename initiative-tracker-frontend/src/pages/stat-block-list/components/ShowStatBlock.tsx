import { useTranslation } from 'react-i18next';
import { StatBlock } from '../../../services/statBlock';
import { useGetSkillsQuery } from '../../../services/skill';
import RightModal, { RightModalRef } from '../../../components/RightModal';
import { useRef } from 'react';
import { Button, Space, Table } from 'antd';

export interface ShowStatBlockProps {
  rowData: StatBlock;
  onClose: () => void;
}

const ShowStatBlock = ({ rowData, onClose }: ShowStatBlockProps) => {
  const modal = useRef<RightModalRef>();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.statBlock.showStatBlock',
  });
  const { t: commonT } = useTranslation();

  const { data: skills, isLoading } = useGetSkillsQuery({});

  const abilityColumns = [
    {
      title: t('ability.columns.name'),
      dataIndex: 'abilityName',
      key: 'abilityName',
    },
    {
      title: t('ability.columns.value'),
      dataIndex: 'abilityValue',
      key: 'abilityValue',
    },
    {
      title: t('ability.columns.bonus'),
      dataIndex: 'abilityBonus',
      key: 'abilityBonus',
      width: 100,
    },
  ];

  const abilityDataSource = rowData.abilityScores.map(score => ({
    ...score,
    abilityName: score.ability.name,
    abilityValue: score.score,
    abilityBonus: (score.score - 10) / 2,
    key: score.ability.id,
  }));

  const skillColumns = [
    {
      title: t('skill.columns.name'),
      dataIndex: 'skillName',
      key: 'skillName',
    },
    {
      title: t('skill.columns.value'),
      dataIndex: 'skillValue',
      key: 'skillValue',
    },
  ];

  const skillDataSource = skills?.items.map(skill => ({
    ...skill,
    skillName: `${skill.name} (${skill.ability.name})`,
    skillValue: rowData.proficientSkills.find(
      proficient => proficient.id === skill.id,
    )
      ? ((rowData.abilityScores.find(
          score => score.ability.id === skill.ability.id,
        )?.score ?? 10) -
          10) /
          2 +
        Math.floor((rowData.level - 1) / 4) +
        2
      : ((rowData.abilityScores.find(
          score => score.ability.id === skill.ability.id,
        )?.score ?? 10) -
          10) /
        2,
  }));
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
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Table
          columns={abilityColumns}
          dataSource={abilityDataSource}
          rowKey={'id'}
          pagination={false}
        />
        <Table
          columns={skillColumns}
          dataSource={skillDataSource}
          rowKey={'id'}
          pagination={false}
        />
      </Space>
    </RightModal>
  );
};

export default ShowStatBlock;
