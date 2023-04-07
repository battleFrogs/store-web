


import { Breadcrumb, Col, Layout, Row, Statistic, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import Footer from '../../Components/Footer';
import Header from '../../Components/Header';
import request from '../../Config/request';
import { getClassesTotal, getRecentClassesAddNum } from '../../Requests/ClassesApi';
import { getStudentTotalUrl, getRecentStudentAddNumUrl } from '../../Requests/StudentApi';
import EChartsReact from 'echarts-for-react';


const { Content } = Layout;


export default function Home() {

    const [classesTotal, setClassesTotal] = useState(0)
    const [studentTotal, setStudentTotal] = useState(0)
    const [classesOption, setClassesOption] = useState({
        title: {
            text: "班级近7天统计",
        },
        tooltip: {},
        legend: {
            data: ["数量"],
        },
        xAxis: {
            data: [],
        },
        yAxis: {},
        series: [
            {
                name: "数量",
                type: "line",
                data: [],
            },
        ],
    })
    const [studentOption, setStudentOption] = useState({
        title: {
            text: "学生近7天统计",
        },
        tooltip: {},
        legend: {
            data: ["数量"],
        },
        xAxis: {
            data: [],
        },
        yAxis: {},
        series: [
            {
                name: "数量",
                type: "line",
                data: [],
            },
        ],
    })


    useEffect(() => {
        request.get(getClassesTotal, {}).then(res => setClassesTotal(res))
        request.get(getStudentTotalUrl, {}).then(res => setStudentTotal(res))
        request.get(getRecentClassesAddNum, {}).then(res => {
            const dateArray = res.map(r => r.date);
            const numArray = res.map(r => r.num);
            setClassesOption({
                title: {
                    text: "班级近7天统计",
                },
                tooltip: {},
                legend: {
                    data: ["数量"],
                },
                xAxis: {
                    data: dateArray,
                },
                yAxis: {},
                series: [
                    {
                        name: "数量",
                        type: "line",
                        data: numArray,
                    },
                ],
            });
        })
        request.get(getRecentStudentAddNumUrl, {}).then(res => {
            const dateArray = res.map(r => r.date);
            const numArray = res.map(r => r.num);
            setStudentOption({
                title: {
                    text: "学生近7天统计",
                },
                tooltip: {},
                legend: {
                    data: ["数量"],
                },
                xAxis: {
                    data: dateArray,
                },
                yAxis: {},
                series: [
                    {
                        name: "数量",
                        type: "line",
                        data: numArray,
                    },
                ],
            });
        })
    }, [])

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
                    <Row gutter={16}>
                        <Col span={4}>
                            <Statistic title="班级数目" value={classesTotal} />
                        </Col>
                        <Col span={12}>
                            <Statistic title="学生数目" value={studentTotal} />
                        </Col>
                    </Row>
                    <div style={{ marginTop: 60 }}></div>

                    <div style={{ display: 'flex' }}>
                        <EChartsReact
                            option={classesOption}
                            style={{ height: '300px', width: '500px' }}
                            className='echarts-for-echarts'
                            theme='my_theme' />
                        <EChartsReact
                            option={studentOption}
                            style={{ height: '300px', width: '500px' }}
                            className='echarts-for-echarts'
                            theme='my_theme' />
                    </div>


                </div>
            </Content>
            <Footer />
        </Layout>
    )
}
