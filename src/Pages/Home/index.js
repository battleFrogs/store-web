


import { Layout, theme, Breadcrumb } from 'antd'
import React from 'react'
import Footer from '../../Components/Footer';
import Header from '../../Components/Header';

const { Content } = Layout;

export default function Home() {

    const { token: { colorBgContainer } } = theme.useToken();

    return (
        <Layout className="site-layout">
            <Header />
            <Content
                style={{ margin: '0 16px' }}
            >
                <Breadcrumb
                    style={{ margin: '16px 0', }}
                >
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                </Breadcrumb>
                <div
                    style={{
                        padding: 24,
                        minHeight: 360,
                        background: colorBgContainer,
                    }}
                >
                    首页内容
                </div>
            </Content>
            <Footer />
        </Layout>
    )
}
