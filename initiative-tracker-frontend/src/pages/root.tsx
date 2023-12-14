// import './root.less';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { Breadcrumb, Layout, Menu, MenuProps, theme } from 'antd';
import { ReactNode } from 'react';
import { AppRoute, appRoutes } from '../App';
import { HomeOutlined } from '@ant-design/icons';

const Root = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'pages' });
  const location = useLocation();
  const pathCrumbs = location.pathname.split('/').slice(1);

  const navigate = useNavigate();
  const { token } = theme.useToken();

  const menu_items = appRoutes.map(route => ({
    label: t(route.labelKey),
    key: route.key,
    path: route.path,
  }));

  const findCrumb = (
    crumb: string,
    routes: AppRoute[],
  ): AppRoute | undefined => {
    if (Number(crumb)) {
      return routes[0];
    } else {
      return routes.find(route => route.key === crumb);
    }
  };

  const constructCrumbs = () => {
    let routes = appRoutes;
    let breadCrumbs: { title: ReactNode; onClick: () => void }[] = [
      { title: <HomeOutlined />, onClick: () => navigate('/') },
    ];
    for (const [index, crumb] of pathCrumbs.entries()) {
      const route = findCrumb(crumb, routes);
      breadCrumbs.push({
        title: t(route?.labelKey ?? 'deafaultLabel'),
        onClick: () => {
          navigate(
            '/' +
              pathCrumbs
                .slice(0, index + 1)
                .reduce((acc, val) => acc + '/' + val),
          );
        },
      });
      routes = route?.children ?? [];
    }
    return breadCrumbs;
  };

  const onClick: MenuProps['onClick'] = (e: {
    key: SetStateAction<string>;
  }) => {
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
          selectedKeys={[
            menu_items.find(item => item.key === pathCrumbs[0])?.key,
          ]}
          onClick={onClick}
          items={menu_items}
        />
      </Header>
      <Content
        style={{
          paddingLeft: token.sizeMD,
          paddingRight: token.sizeMD,
        }}
      >
        <Breadcrumb style={{ margin: '16px 0' }} items={constructCrumbs()} />
        <div
          style={{
            background: token.colorBgContainer,
            minHeight: 700,
            padding: 24,
            borderRadius: token.borderRadiusLG,
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
