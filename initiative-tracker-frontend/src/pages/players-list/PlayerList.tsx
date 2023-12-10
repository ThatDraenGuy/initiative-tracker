import { Button, Space, Table, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useGetPlayersQuery } from '../../services/player';
import CreatePlayer from './components/CreatePlayer';
import DeletePlayer from './components/DeletePlayer';

const PlayerList = () => {
  const { token } = theme.useToken();
  const [openedModal, setOpenedModal] = useState('');
  const [selectedRow, setSelectedRow] = useState<number | undefined>(undefined);

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
      name: player.name,
      id: player.id,
      ...player,
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
            onClick={() => setOpenedModal('create_player')}
          >
            {t('buttons.createPlayer')}
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => {
              if (selectedRow != undefined) {
                setOpenedModal('delete_player');
              }
            }}
            disabled={selectedRow === undefined}
          >
            {t('buttons.deletePlayer')}
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
          }}
          columns={columns}
          dataSource={dataSource}
          rowKey={'id'}
          loading={isLoading}
        />
      </Space>
      <CreatePlayer
        open={openedModal === 'create_player'}
        onClose={() => setOpenedModal('')}
      />
      <DeletePlayer
        open={openedModal === 'delete_player' && selectedRow !== undefined}
        playerId={selectedRow === undefined ? 0 : selectedRow}
        onClose={() => {
          setOpenedModal('undefined');
          setSelectedRow(undefined);
        }}
      />
    </>
  );
};

export default PlayerList;
