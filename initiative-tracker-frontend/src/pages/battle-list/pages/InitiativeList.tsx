import { useParams } from 'react-router-dom';
import {
  InitiativeEntry,
  useGetBattleByIdQuery,
  useNextInitiativeMutation,
} from '../../../services/battle';
import { Avatar, Button, Card, Col, List, Row, Space, Spin, theme } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Title from 'antd/lib/typography/Title';
import {
  EditOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  RightOutlined,
  UserOutlined,
} from '@ant-design/icons';
import DamageCharacter from './components/DamageCharacter';
import HealCharacter from './components/HealCharacter';
import EditCurrentStats from './components/EditCurrentStats';

const InitiativeList = () => {
  const { token } = theme.useToken();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.battle.initiative',
  });
  const [openedModal, setOpenedModal] = useState<
    { entry: InitiativeEntry; modal: String } | undefined
  >();

  const { battleId: battleIdStr } = useParams();
  const battleId = Number(battleIdStr);
  const { data: battle, isLoading } = useGetBattleByIdQuery(battleId);
  const [nextInitiative, { isLoading: isNextInitiativeLoading }] =
    useNextInitiativeMutation();

  const entriesDataSource = battle?.entries ?? [];

  const onNextInitiativeClick = async () => {
    await nextInitiative(battleId);
  };
  return (
    <>
      <Space direction="vertical" size="small" style={{ display: 'flex' }}>
        <Space
          direction="horizontal"
          size="middle"
          style={{ padding: token.sizeSM }}
        >
          <Card>
            {t('titles.roundNumber', { roundNumber: battle?.roundNumber ?? 0 })}
          </Card>
          <Button
            icon={<RightOutlined />}
            onClick={() => onNextInitiativeClick()}
          >
            {t('buttons.nextInitiative')}
          </Button>
        </Space>
        <Spin spinning={isLoading || isNextInitiativeLoading}>
          <List
            itemLayout="vertical"
            dataSource={entriesDataSource}
            renderItem={(entry, index) => (
              <List.Item
                key={entry.currentStats.id}
                style={{
                  padding: token.sizeSM,
                  ...(battle?.currentCharacterIndex === index + 1
                    ? { backgroundColor: token.colorBgElevated }
                    : {}),
                }}
                extra={
                  <Title style={{ color: token.colorText }}>{entry.roll}</Title>
                }
                actions={[
                  <Button
                    icon={<MinusCircleOutlined />}
                    onClick={() =>
                      setOpenedModal({ entry: entry, modal: 'damage' })
                    }
                  >
                    {t('actions.damage')}
                  </Button>,
                  <Button
                    icon={<PlusCircleOutlined />}
                    onClick={() =>
                      setOpenedModal({ entry: entry, modal: 'heal' })
                    }
                  >
                    {t('actions.heal')}
                  </Button>,
                  <Button
                    icon={<EditOutlined />}
                    onClick={() =>
                      setOpenedModal({ entry: entry, modal: 'edit' })
                    }
                  >
                    {t('actions.edit')}
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={
                    entry.character.statBlock.entityName +
                    (entry.character.player
                      ? ` (${entry.character.player.name})`
                      : '')
                  }
                  description={
                    <>
                      <Row>
                        <Col span={4}>{t('columns.hitPoints')}</Col>
                        <Col span={4}>{t('columns.tempHitPoints')}</Col>
                        <Col span={4}>{t('columns.hitDiceCount')}</Col>
                        <Col span={4}>{t('columns.armorClass')}</Col>
                        <Col span={4}>{t('columns.speed')}</Col>
                      </Row>
                      <Row>
                        {Object.entries(entry.currentStats)
                          .filter(([key]) => key !== 'id')
                          .map(([key, value]) => (
                            <Col key={key} span={4}>
                              <Title
                                level={5}
                                style={{ color: token.colorText }}
                              >
                                {value ??
                                  Object.entries(
                                    entry.character.statBlock,
                                  ).find(([sbKey]) => sbKey === key)?.[1]}
                                {' / '}
                                {
                                  Object.entries(
                                    entry.character.statBlock,
                                  ).find(([sbKey]) => sbKey === key)?.[1]
                                }
                              </Title>
                            </Col>
                          ))}
                      </Row>
                    </>
                  }
                  avatar={<Avatar size="large" icon={<UserOutlined />} />}
                />
              </List.Item>
            )}
          />
        </Spin>
      </Space>
      {openedModal?.modal === 'damage' && (
        <DamageCharacter
          entry={openedModal.entry}
          onClose={() => setOpenedModal(undefined)}
        />
      )}
      {openedModal?.modal === 'heal' && (
        <HealCharacter
          entry={openedModal.entry}
          onClose={() => setOpenedModal(undefined)}
        />
      )}
      {openedModal?.modal === 'edit' && (
        <EditCurrentStats
          entry={openedModal.entry}
          onClose={() => setOpenedModal(undefined)}
        />
      )}
    </>
  );
};

export default InitiativeList;
