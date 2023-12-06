import './root.scss'
import { Layout, Menu, MenuProps, theme } from "antd"
import { Content, Footer, Header } from "antd/es/layout/layout";
import { useState } from 'react';
import { Outlet, useNavigate } from "react-router"

const className = "root-page";

const Root = () => {
    const [current, setCurrent] = useState('home');
    const navigate = useNavigate();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const menu_items = [{
        label: 'Home',
        key: 'home',
        path: '/'
    },
    {
        label: 'Tracker',
        key: 'tracker',
        path: '/tracker'
    }];

    const onClick: MenuProps['onClick'] = e => {
        setCurrent(e.key);
        navigate(menu_items.find(item => item.key === e.key)?.path ?? '/');
    }

    return <Layout className={`${className}`} >
        <Header style={{ display: 'flex', alignItems: 'center' }}>
            <div className="demo-logo" />
            <Menu
                style={{ width: '100%' }}
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={[current]}
                onClick={onClick}
                items={menu_items}
            />
        </Header>
        <Content style={{ padding: '0 50px' }}>
            <div className={`${className}-content`} style={{ background: colorBgContainer }}>
                <Outlet />
            </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>ITMO 2023 - Created by ThatDraenGuy & Moyaknt</Footer>
    </Layout >

}

export default Root;