import { PieChartOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

const { Sider } = Layout;

export default function NavLeft() {

    const [collapsed, setCollapsed] = useState(false);

    // 获取左侧导航栏的内容信息
    const items = [
        getItem(<Link to="/page/home">首页内容</Link>, '1', <PieChartOutlined />),
        getItem('用户操作', '2', <PieChartOutlined />, [getItem(<Link to="/user/student">学生列表</Link>, '3')]),
    ];
    function getItem(label, key, icon, children) {
        return { key, icon, children, label };
    }


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
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
            </Sider>
            <Outlet />
        </Layout>
    )
}
