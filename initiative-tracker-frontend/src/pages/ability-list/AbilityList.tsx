import { Button, Space, Table, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Ability, useGetAbilitiesQuery } from '../../services/ability';
import CreateAbility from './components/CreateAbility';
import DeleteAbility from './components/DeleteAbility';

const AbilityList = () => {
  const { token } = theme.useToken();
  const [openedModal, setOpenedModal] = useState('');
  const [selectedRow, setSelectedRow] = useState<Ability | undefined>(
    undefined,
  );

  const { data: abilitys, isLoading } = useGetAbilitiesQuery({});
  const { t } = useTranslation('translation', { keyPrefix: 'pages.ability' });

  const columns = [
    {
      title: t('columns.name'),
      dataIndex: 'name',
      key: 'name',
    },
  ];

  const dataSource =
    abilitys?.items.map(ability => ({
      ...ability,
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
            onClick={() => setOpenedModal('create_ability')}
          >
            {t('buttons.createAbility')}
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => setOpenedModal('delete_ability')}
            disabled={selectedRow === undefined}
          >
            {t('buttons.deleteAbility')}
          </Button>
        </Space>
        <Table
          onRow={(record: Ability) => ({
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
      {openedModal === 'create_ability' && (
        <CreateAbility onClose={() => setOpenedModal('')} />
      )}
      {openedModal === 'delete_ability' && selectedRow?.id && (
        <DeleteAbility
          abilityId={selectedRow.id}
          onClose={() => {
            setOpenedModal('');
            setSelectedRow(undefined);
          }}
        />
      )}
    </>
  );
};

export default AbilityList;
