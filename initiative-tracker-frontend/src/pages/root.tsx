// import './root.less';
import { Layout, Menu, MenuProps, theme } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { SetStateAction, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';

const Root = () => {
  const [current, setCurrent] = useState('home');
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const menu_items = [
    {
      label: 'Home',
      key: 'home',
      path: '/',
    },
    {
      label: 'Battles',
      key: 'battles',
      path: '/battles',
    },
  ];

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
            src="public/logo.png"
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
