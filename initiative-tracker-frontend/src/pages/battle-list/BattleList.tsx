import { Button, Space, Table, theme } from 'antd';
import { useGetBattlesQuery } from '../../services/battle';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import StartBattle from './components/StartBattle';
import EndBattle from './components/EndBattle';

const BattleList = () => {
  const { token } = theme.useToken();
  const [openedModal, setOpenedModal] = useState('');
  const [selectedRow, setSelectedRow] = useState<number | undefined>(undefined);

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

  // const rowSelection = {
  //   onChange: (selectedRowKeys: React.Key[]) => {
  //     setSelectedRow(selectedRowKeys[0] as number);
  //   },
  // };

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
          onRow={(record: { id: number }) => ({
            onClick: () =>
              setSelectedRow(selectedRow === record.id ? undefined : record.id),
          })}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [selectedRow],
            columnWidth: 0,
            renderCell: () => {},
          }}
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
      <EndBattle
        open={openedModal === 'end_battle' && selectedRow !== undefined}
        battleId={selectedRow === undefined ? 0 : selectedRow}
        onClose={() => {
          setOpenedModal('undefined');
          setSelectedRow(undefined);
        }}
      />
    </>
  );
};

export default BattleList;
