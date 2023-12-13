import { Button, Space, Table, theme } from 'antd';
import { useState } from 'react';
import {
  CharacterBrief,
  useGetCharactersBriefQuery,
} from '../../services/character';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import CreateCharacter from './components/CreateCharacter';
import DeleteCharacter from './components/DeleteCharacter';

const CharacterList = () => {
  const { token } = theme.useToken();
  const { t } = useTranslation('translation', { keyPrefix: 'pages.character' });
  const { t: commonT } = useTranslation();
  const [openedModal, setOpenedModal] = useState('');
  const { data: characters, isLoading } = useGetCharactersBriefQuery({});
  const [selectedRow, setSelectedRow] = useState<CharacterBrief | undefined>();

  const columns = [
    {
      title: t('columns.player'),
      dataIndex: 'playerName',
      key: 'player',
    },
    {
      title: t('columns.statBlock'),
      dataIndex: 'entityName',
      key: 'statBlock',
    },
  ];

  const dataSource = characters?.items.map(character => ({
    playerName: character.player?.name,
    entityName: character.statBlock.entityName,
    ...character,
  }));

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
            onClick={() => setOpenedModal('create_character')}
          >
            {commonT('buttons.create')}
          </Button>
          <Button
            icon={<DeleteOutlined />}
            disabled={selectedRow === undefined}
            onClick={() => setOpenedModal('delete_character')}
          >
            {commonT('buttons.delete')}
          </Button>
        </Space>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey={'id'}
          loading={isLoading}
          onRow={(record: CharacterBrief) => ({
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
        />
      </Space>
      {openedModal === 'create_character' && (
        <CreateCharacter onClose={() => setOpenedModal('')} />
      )}
      {openedModal === 'delete_character' && selectedRow?.id && (
        <DeleteCharacter
          characterId={selectedRow.id}
          onClose={() => {
            setOpenedModal('');
            setSelectedRow(undefined);
          }}
        />
      )}
    </>
  );
};

export default CharacterList;
