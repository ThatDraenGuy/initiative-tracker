import { Button, Space, Table, theme } from 'antd';
import { useState } from 'react';
import { useGetCharactersQuery } from '../../services/character';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import CreateCharacter from './components/CreateCharacter';

const CharacterList = () => {
  const { token } = theme.useToken();
  const { t } = useTranslation('translation', { keyPrefix: 'pages.character' });
  const { t: commonT } = useTranslation();
  const [openedModal, setOpenedModal] = useState('');
  const { data: characters, isLoading } = useGetCharactersQuery({});

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
        />
      </Space>
      <CreateCharacter
        open={openedModal === 'create_character'}
        onClose={() => setOpenedModal('')}
      />
    </>
  );
};

export default CharacterList;
