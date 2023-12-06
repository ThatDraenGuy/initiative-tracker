import { Table } from 'antd';
import { useGetBattlesQuery } from '../../services/battle';
import { useTranslation } from 'react-i18next';

const BattleList = () => {
  const { data: battles, isLoading } = useGetBattlesQuery({});
  const { t } = useTranslation('translation', { keyPrefix: 'pages.battle' });

  const columns = [
    {
      title: t('columns.roundNumber'),
      dataIndex: 'roundNumber',
      key: 'roundNumber',
    },
    {
      title: t('columns.characters'),
      dataIndex: 'characters',
      key: 'characters',
    },
  ];

  const datasource =
    battles?.items.map(battle => ({
      characters: `${battle.currentCharacterIndex}/${battle.characterAmount}`,
      ...battle,
    })) ?? [];

  return (
    <>
      <Table
        columns={columns}
        dataSource={datasource}
        rowKey={'id'}
        loading={isLoading}
      />
    </>
  );
};

export default BattleList;
