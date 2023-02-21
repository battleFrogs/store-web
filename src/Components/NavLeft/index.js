import { Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { result, menu } from '../../Constants/menuInfo';

const { Sider } = Layout;

export default function NavLeft() {

    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div
                    style={{
                        height: 32,
                        margin: 16,
                        background: 'rgba(255, 255, 255, 0.2)',
                    }}
                />
                <Menu theme="dark" selectedKeys={['1']} mode="inline" items={result(menu)} />
            </Sider>
            <Outlet />
        </Layout>
    )
}
