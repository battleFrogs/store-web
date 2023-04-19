import { Breadcrumb, Layout, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from '..//Footer';
import Header from '../Header';
import NavLeft from '../NavLeft';
import { getKeyByPathName, getLabelNameByPathName, menu } from '../../Constants/menuInfo';


const { Content } = Layout

export default function ContentLayout() {

    const [breadcrumbName, setBreadCrumbName] = useState([])
    const [selectKeys, setSelectKeys] = useState([]);


    useEffect(() => {
        let keyArray = getLabelNameByPathName(menu, selectKeys);
        setBreadCrumbName(keyArray)
    }, [selectKeys])


    const getBreadCrumbResult = () => {
        let result = []
        breadcrumbName.forEach((index) => {
            result.push(<Breadcrumb.Item>{index}</Breadcrumb.Item>)
        })

        return (
            <Breadcrumb
                style={{ margin: '16px 0', }}
            >
                {result}
            </Breadcrumb>
        )
    }

    const { token: { colorBgContainer } } = theme.useToken();
    return (

        <Layout style={{ minHeight: '100vh' }}>
            <NavLeft selectKeys={selectKeys} setSelectKeys={setSelectKeys} />
            <Layout className="site-layout">
                <Header />
                <Content
                    style={{ margin: '0 16px' }}
                >
                    {getBreadCrumbResult()}
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
            </Layout >
        </Layout>
    )
}
