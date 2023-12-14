import { Button, Space, Table, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import {
  CreatureType,
  useGetCreatureTypesQuery,
} from '../../services/creatureType';
import CreateCreatureType from './components/CreateCreatureType';
import DeleteCreatureType from './components/DeleteCreatureType';

const CreatureTypeList = () => {
  const { token } = theme.useToken();
  const [openedModal, setOpenedModal] = useState('');
  const [selectedRow, setSelectedRow] = useState<CreatureType | undefined>(
    undefined,
  );

  const { data: creatureTypes, isLoading } = useGetCreatureTypesQuery({});
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.creatureType',
  });

  const columns = [
    {
      title: t('columns.name'),
      dataIndex: 'name',
      key: 'name',
    },
  ];

  const dataSource =
    creatureTypes?.items.map(creatureType => ({
      ...creatureType,
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
            onClick={() => setOpenedModal('create_creature_type')}
          >
            {t('buttons.createCreatureType')}
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => setOpenedModal('delete_creature_type')}
            disabled={selectedRow === undefined}
          >
            {t('buttons.deleteCreatureType')}
          </Button>
        </Space>
        <Table
          onRow={(record: CreatureType) => ({
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
      {openedModal === 'create_creature_type' && (
        <CreateCreatureType onClose={() => setOpenedModal('')} />
      )}
      {openedModal === 'delete_creature_type' && selectedRow?.id && (
        <DeleteCreatureType
          creatureTypeId={selectedRow.id}
          onClose={() => {
            setOpenedModal('');
            setSelectedRow(undefined);
          }}
        />
      )}
    </>
  );
};

export default CreatureTypeList;
