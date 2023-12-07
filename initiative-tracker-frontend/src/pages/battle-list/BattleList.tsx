import { Button, Space, Table, theme } from 'antd';
import { useGetBattlesQuery } from '../../services/battle';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import StartBattle from './components/StartBattle';

const BattleList = () => {
  const { token } = theme.useToken();
  const [openedModal, setOpenedModal] = useState('');
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

  const dataSource =
    battles?.items.map(battle => ({
      characters: `${battle.currentCharacterIndex}/${battle.characterAmount}`,
      ...battle,
    })) ?? [];

  return (
    <>
      <Space direction="vertical" size="small" style={{ display: 'flex' }}>
        <Space
          direction="horizontal"
          size="middle"
          style={{ padding: token.sizeSM }}
        >
          <Button
            icon={<PlusOutlined />}
            onClick={() => setOpenedModal('start_battle')}
          >
            {t('buttons.startBattle')}
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => setOpenedModal('end_battle')}
          >
            {t('buttons.endBattle')}
          </Button>
        </Space>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey={'id'}
          loading={isLoading}
        />
      </Space>
      <StartBattle
        open={openedModal === 'start_battle'}
        onClose={() => setOpenedModal('')}
      />
    </>
  );
};

export default BattleList;
