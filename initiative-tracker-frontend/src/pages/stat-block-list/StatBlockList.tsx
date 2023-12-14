import {
  DeleteOutlined,
  PlusOutlined,
  SnippetsOutlined,
} from '@ant-design/icons';
import { Button, Space, Table, theme } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatBlock, useGetStatBlocksQuery } from '../../services/statBlock';
import ShowStatBlock from './components/ShowStatBlock';
import CreateStatBlock from './components/CreateStatBlock';

const StatBlockList = () => {
  const { token } = theme.useToken();
  const { t } = useTranslation('translation', { keyPrefix: 'pages.statBlock' });
  const { t: commonT } = useTranslation();
  const [openedModal, setOpenedModal] = useState('');
  const [selected, setSelected] = useState<StatBlock | undefined>();
  const { data: statBlocks, isLoading } = useGetStatBlocksQuery({});

  const columns = [
    {
      title: t('columns.entityName'),
      dataIndex: 'entityName',
      key: 'entityName',
    },
    {
      title: t('columns.hitPoints'),
      dataIndex: 'hitPoints',
      key: 'hitPoints',
      width: 150,
    },
    {
      title: t('columns.hitDiceType'),
      dataIndex: 'hitDiceType',
      key: 'hitDiceType',
      width: 150,
    },
    {
      title: t('columns.hitDiceCount'),
      dataIndex: 'hitDiceCount',
      key: 'hitDiceCount',
      width: 150,
    },
    {
      title: t('columns.armorClass'),
      dataIndex: 'armorClass',
      key: 'armorClass',
      width: 150,
    },
    {
      title: t('columns.speed'),
      dataIndex: 'speed',
      key: 'speed',
      width: 150,
    },
    {
      title: t('columns.level'),
      dataIndex: 'level',
      key: 'level',
      width: 100,
    },
    {
      title: t('columns.creatureTypeName'),
      dataIndex: 'creatureTypeName',
      key: 'creatureTypeName',
      width: 200,
    },
  ];

  const dataSource =
    statBlocks?.items.map(statBlock => ({
      ...statBlock,
      creatureTypeName: statBlock.creatureType.name,
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
            onClick={() => setOpenedModal('create')}
          >
            {commonT('buttons.create')}
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => setOpenedModal('delete')}
            disabled={selected === undefined}
          >
            {commonT('buttons.delete')}
          </Button>
          <Button
            icon={<SnippetsOutlined />}
            onClick={() => setOpenedModal('stats')}
            disabled={selected === undefined}
          >
            {t('buttons.stats')}
          </Button>
        </Space>
        <Table
          onRow={(record: StatBlock) => ({
            onClick: () =>
              setSelected(selected?.id === record.id ? undefined : record),
          })}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [selected?.id],
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
      {openedModal === 'create' && (
        <CreateStatBlock onClose={() => setOpenedModal('')} />
      )}
      {openedModal === 'stats' && selected && (
        <ShowStatBlock rowData={selected} onClose={() => setOpenedModal('')} />
      )}
    </>
  );
};

export default StatBlockList;
