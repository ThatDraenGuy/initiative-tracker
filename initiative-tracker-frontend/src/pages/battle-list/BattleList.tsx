import { Button, Space, Table, theme } from 'antd';
import { BattleBrief, useGetBattlesBriefQuery } from '../../services/battle';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import StartBattle from './components/StartBattle';
import EndBattle from './components/EndBattle';
import { useNavigate } from 'react-router-dom';
import Link from 'antd/lib/typography/Link';

const BattleList = () => {
  const { token } = theme.useToken();
  const [openedModal, setOpenedModal] = useState('');
  const [selectedRow, setSelectedRow] = useState<BattleBrief | undefined>(
    undefined,
  );
  const navigate = useNavigate();

  const { data: battles, isLoading } = useGetBattlesBriefQuery({});
  const { t } = useTranslation('translation', { keyPrefix: 'pages.battle' });

  const columns = [
    {
      title: t('columns.tracker'),
      dataIndex: 'id',
      key: 'id',
      render: (value: string) => (
        <Link onClick={() => navigate(String(value))}>
          {t('columns.trackerLink')}
        </Link>
      ),
    },
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
          onRow={(record: BattleBrief) => ({
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
