import { useParams } from 'react-router-dom';
import { useGetBattleByIdQuery } from '../../../services/battle';
import { Avatar, Button, Card, Col, List, Row, Space, theme } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Title from 'antd/lib/typography/Title';
import {
  MinusCircleOutlined,
  PlusCircleOutlined,
  RightOutlined,
  UserOutlined,
} from '@ant-design/icons';

const InitiativeList = () => {
  const { token } = theme.useToken();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.battle.initiative',
  });
  const [openedModal, setOpenedModal] = useState('');

  const { battleId } = useParams();
  const { data: battle, isLoading } = useGetBattleByIdQuery(Number(battleId));

  const entriesDataSource = battle?.entries ?? [];
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
          <Button icon={<RightOutlined />}>
            {t('buttons.nextInitiative')}
          </Button>
        </Space>
        <List
          itemLayout="vertical"
          dataSource={entriesDataSource}
          renderItem={(entry, index) => (
            <List.Item
              key={entry.currentStats.id}
              style={
                battle?.currentCharacterIndex === index + 1
                  ? { backgroundColor: token.colorBgElevated }
                  : {}
              }
              extra={
                <Title style={{ color: token.colorText }}>{entry.roll}</Title>
              }
              actions={[
                // <Space>
                //   <WarningOutlined />
                //   {t('actions.damage')}
                // </Space>,
                <Button icon={<MinusCircleOutlined />}>
                  {t('actions.damage')}
                </Button>,
                <Button icon={<PlusCircleOutlined />}>
                  {t('actions.heal')}
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
                            <Title level={5} style={{ color: token.colorText }}>
                              {value}
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
      </Space>
    </>
  );
};

export default InitiativeList;
