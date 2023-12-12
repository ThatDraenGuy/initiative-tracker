// import './root.less';
import { Layout, Menu, MenuProps, theme } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';

const Root = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'pages' });
  const location = useLocation();

  const navigate = useNavigate();
  const { token } = theme.useToken();

  const menu_items = [
    {
      label: t('home.label'),
      key: 'home',
      path: '/',
    },
    {
      label: t('battle.label'),
      key: 'battles',
      path: '/battles',
    },
    {
      label: t('character.label'),
      key: 'characters',
      path: '/characters',
    },
    {
      label: t('player.label'),
      key: 'players',
      path: '/players',
    },
    {
      label: t('statBlock.label'),
      key: 'statBlocks',
      path: '/statBlocks',
    },
  ];

  const [current, setCurrent] = useState(
    menu_items.find(item => item.path === location.pathname)?.key ?? 'home',
  );

  const onClick: MenuProps['onClick'] = (e: {
    key: SetStateAction<string>;
  }) => {
    setCurrent(e.key);
    navigate(menu_items.find(item => item.key === e.key)?.path ?? '/');
  };

  return (
    <Layout style={{ height: '100%' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src="/logo.png"
            style={{ width: token.sizeXXL, height: '100%' }}
          />
        </div>
        <Menu
          style={{ width: '100%' }}
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[current]}
          onClick={onClick}
          items={menu_items}
        />
      </Header>
      <Content
        style={{
          paddingLeft: token.sizeMD,
          paddingRight: token.sizeMD,
          margin: token.sizeSM,
          backgroundColor: token.colorBgBlur,
        }}
      >
        <div
          style={{
            background: token.colorBgContainer,
            height: '100%',
          }}
        >
          <Outlet />
        </div>
      </Content>
      <Footer
        style={{
          backgroundColor: token.colorBgSpotlight,
          textAlign: 'center',
        }}
      >
        ITMO 2023 - Created by ThatDraenGuy & Moyaknt
      </Footer>
    </Layout>
  );
};

export default Root;
