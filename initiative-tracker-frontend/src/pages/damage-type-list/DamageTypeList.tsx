import { Button, Space, Table, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { DamageType, useGetDamageTypesQuery } from '../../services/damageType';
import CreateDamageType from './components/CreateDamageType';
import DeleteDamageType from './components/DeleteDamageType';

const DamageTypeList = () => {
  const { token } = theme.useToken();
  const [openedModal, setOpenedModal] = useState('');
  const [selectedRow, setSelectedRow] = useState<DamageType | undefined>(
    undefined,
  );

  const { data: damageTypes, isLoading } = useGetDamageTypesQuery({});
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.damageType',
  });

  const columns = [
    {
      title: t('columns.name'),
      dataIndex: 'name',
      key: 'name',
    },
  ];

  const dataSource =
    damageTypes?.items.map(damageType => ({
      ...damageType,
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
            onClick={() => setOpenedModal('create_damageType')}
          >
            {t('buttons.createDamageType')}
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => setOpenedModal('delete_damageType')}
            disabled={selectedRow === undefined}
          >
            {t('buttons.deleteDamageType')}
          </Button>
        </Space>
        <Table
          onRow={(record: DamageType) => ({
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
      {openedModal === 'create_damageType' && (
        <CreateDamageType onClose={() => setOpenedModal('')} />
      )}
      {openedModal === 'delete_damageType' && selectedRow?.id && (
        <DeleteDamageType
          damageTypeId={selectedRow.id}
          onClose={() => {
            setOpenedModal('');
            setSelectedRow(undefined);
          }}
        />
      )}
    </>
  );
};

export default DamageTypeList;
