import { Button, Space, Table, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Player, useGetPlayersQuery } from '../../services/player';
import CreatePlayer from './components/CreatePlayer';
import DeletePlayer from './components/DeletePlayer';

const PlayerList = () => {
  const { token } = theme.useToken();
  const [openedModal, setOpenedModal] = useState('');
  const [selectedRow, setSelectedRow] = useState<Player | undefined>(undefined);

  const { data: players, isLoading } = useGetPlayersQuery({});
  const { t } = useTranslation('translation', { keyPrefix: 'pages.player' });

  const columns = [
    {
      title: t('columns.name'),
      dataIndex: 'name',
      key: 'name',
    },
  ];

  const dataSource =
    players?.items.map(player => ({
      ...player,
    })) ?? [];

  return (
    <>
      <Space direction="vertical" size="small" style={{ display: 'flex' }}>
        <Space
          direction="horizontal"
          size="middle"
          style={{ padding: token.sizeSM, width: '100%', overflow: 'auto' }}
        >
          <Button
            icon={<PlusOutlined />}
            onClick={() => setOpenedModal('create_player')}
          >
            {t('buttons.createPlayer')}
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => setOpenedModal('delete_player')}
            disabled={selectedRow === undefined}
          >
            {t('buttons.deletePlayer')}
          </Button>
        </Space>
        <Table
          onRow={(record: Player) => ({
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
          style={{ width: '100%', overflow: 'auto' }}
        />
      </Space>
      {openedModal === 'create_player' && (
        <CreatePlayer onClose={() => setOpenedModal('')} />
      )}
      {openedModal === 'delete_player' && selectedRow?.id && (
        <DeletePlayer
          playerId={selectedRow.id}
          onClose={() => {
            setOpenedModal('');
            setSelectedRow(undefined);
          }}
        />
      )}
    </>
  );
};

export default PlayerList;
