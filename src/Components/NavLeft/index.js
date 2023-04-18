import { Button, Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { result, menu, getKeyByPathName, getOpenKeys } from '../../Constants/menuInfo';

const { Sider } = Layout;

export default function NavLeft() {

    const [collapsed, setCollapsed] = useState(false);
    const [selectKeys, setSelectKeys] = useState([]);
    const [identity, setIdentity] = useState('student')

    let location = useLocation();

    useEffect(() => {
        let keyArray = getKeyByPathName(menu, location.pathname);
        setSelectKeys(keyArray || ['1'])
        setIdentity(sessionStorage.getItem("identity"))
    }, [])

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
                <Menu theme="dark" onSelect={({ key }) => { setSelectKeys([key]) }} selectedKeys={selectKeys}
                    openKeys={getOpenKeys()} mode="inline" items={result(menu, identity)} />
            </Sider>
            <Outlet />
        </Layout>
    )
}
