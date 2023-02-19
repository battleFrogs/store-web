import { Breadcrumb, Layout, theme } from 'antd';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../../Components/Footer';
import Header from '../../Components/Header';
import NavLeft from '../../Components/NavLeft';


const { Content } = Layout;




export default function User() {

    const { token: { colorBgContainer } } = theme.useToken();

    return (
        <div>
            <Layout style={{ minHeight: '100vh' }}>
                <NavLeft />
                <Layout className="site-layout">
                    <Header />
                    <Content
                        style={{ margin: '0 16px' }}
                    >
                        <Breadcrumb
                            style={{ margin: '16px 0', }}
                        >
                            <Breadcrumb.Item>User</Breadcrumb.Item>
                            <Breadcrumb.Item>Bill</Breadcrumb.Item>
                        </Breadcrumb>
                        <div
                            style={{
                                padding: 24,
                                minHeight: 360,
                                background: colorBgContainer,
                            }}
                        >
                            <Outlet />
                        </div>
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
        </div>
    )
}
