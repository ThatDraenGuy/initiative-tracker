import { Button, Space, Table, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Skill, useGetSkillsQuery } from '../../services/skill';
import CreateSkill from './components/CreateSkill';
import DeleteSkill from './components/DeleteSkill';

const SkillList = () => {
  const { token } = theme.useToken();
  const [openedModal, setOpenedModal] = useState('');
  const [selectedRow, setSelectedRow] = useState<Skill | undefined>(undefined);

  const { data: skills, isLoading } = useGetSkillsQuery({});
  const { t } = useTranslation('translation', { keyPrefix: 'pages.skill' });

  const columns = [
    {
      title: t('columns.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('columns.ability'),
      dataIndex: 'abilityName',
      key: 'abilityName',
    },
  ];

  const dataSource =
    skills?.items.map(skill => ({
      abilityName: `${skill.ability.name}`,
      ...skill,
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
            onClick={() => setOpenedModal('create_skill')}
          >
            {t('buttons.createSkill')}
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => setOpenedModal('delete_skill')}
            disabled={selectedRow === undefined}
          >
            {t('buttons.deleteSkill')}
          </Button>
        </Space>
        <Table
          onRow={(record: Skill) => ({
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
      {openedModal === 'create_skill' && (
        <CreateSkill onClose={() => setOpenedModal('')} />
      )}
      {openedModal === 'delete_skill' && selectedRow?.id && (
        <DeleteSkill
          skillId={selectedRow.id}
          onClose={() => {
            setOpenedModal('');
            setSelectedRow(undefined);
          }}
        />
      )}
    </>
  );
};

export default SkillList;
