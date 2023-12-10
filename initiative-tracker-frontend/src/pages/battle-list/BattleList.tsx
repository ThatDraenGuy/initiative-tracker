import { Button, Space, Table, theme } from 'antd';
import { Battle, useGetBattlesQuery } from '../../services/battle';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import StartBattle from './components/StartBattle';
import EndBattle from './components/EndBattle';

const BattleList = () => {
  const { token } = theme.useToken();
  const [openedModal, setOpenedModal] = useState('');
  const [selectedRow, setSelectedRow] = useState<Battle | undefined>(undefined);

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
            disabled={selectedRow === undefined}
            onClick={() => setOpenedModal('end_battle')}
          >
            {t('buttons.endBattle')}
          </Button>
        </Space>
        <Table
          onRow={(record: Battle) => ({
            onClick: () =>
              setSelectedRow(
                selectedRow?.id === record.id ? undefined : record,
              ),
          })}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [selectedRow?.id],
            columnWidth: 0,
            renderCell: () => {},
          }}
          columns={columns}
          dataSource={dataSource}
          rowKey={'id'}
          loading={isLoading}
        />
      </Space>
      {openedModal === 'start_battle' && (
        <StartBattle onClose={() => setOpenedModal('')} />
      )}
      {openedModal === 'end_battle' && selectedRow?.id && (
        <EndBattle
          battleId={selectedRow.id}
          onClose={() => {
            setOpenedModal('');
            setSelectedRow(undefined);
          }}
        />
      )}
    </>
  );
};

export default BattleList;
