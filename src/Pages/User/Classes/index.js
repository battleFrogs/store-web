import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Form, Input, InputNumber, Layout, Space, Table, theme, Modal, Popconfirm, Pagination } from 'antd';
import Footer from '../../../Components/Footer';
import Header from '../../../Components/Header';
import request from '../../../Config/request';
import { deleteById, getPageClassesList, insertClassesData } from '../../../Requests/ClassesApi';


const { Content } = Layout;


export default function Classes() {


    const { token: { colorBgContainer } } = theme.useToken();
    const [form] = Form.useForm()
    const [modalShow, setModalShow] = useState(false)
    const [dataSource, setDataSource] = useState([])

    useEffect(() => {
        request.get(getPageClassesList, { pageIndex: 1, pageSize: 10 }).then((res) => setDataSource(res.students))
    }, [])

    const columns = [{

        title: 'id',
        dataIndex: 'id',
        key: 'id',
        width: '20%',
    },
    {
        title: '班级名称',
        dataIndex: 'className',
        key: 'className',
        width: '20%',

    },
    {
        title: '年级',
        dataIndex: 'grade',
        key: 'grade',
        width: '20%',

    },
    {
        title: '操作',
        key: 'action',
        width: '20%',
        render: (_, record) => {
            return <Button type='primary' onClick={() => deleteData(record.id)}>删除</Button>
        }
    },

    ]

    const insertData = async () => {
        await form.validateFields()
        const values = form.getFieldsValue()
        request.postJson(insertClassesData, {}, values).then(res => {
            setModalShow(false);
            request.get(getPageClassesList, { pageIndex: 1, pageSize: 10 }).then((res) => setDataSource(res.students))
        })
    }

    const deleteData = (id) => {
        request.get(deleteById, { id })
        request.get(getPageClassesList, { pageIndex: 1, pageSize: 10 }).then((res) => setDataSource(res.students))
    }

    return (
        <Layout className="site-layout">
            <Header />
            <Content
                style={{ margin: '0 16px' }}
            >
                <Breadcrumb
                    style={{ margin: '16px 0', }}
                >
                    <Breadcrumb.Item>用户操作</Breadcrumb.Item>
                    <Breadcrumb.Item>班级信息</Breadcrumb.Item>
                </Breadcrumb>
                <div
                    style={{
                        padding: 24,
                        minHeight: 360,
                        background: colorBgContainer,
                    }}
                >
                    <Button type='primary' onClick={() => setModalShow(true)}>新增</Button>
                    <div style={{ marginTop: 15 }}></div>
                    <Table columns={columns} bordered={true} dataSource={dataSource}></Table>
                </div>
                <Modal title="新增数据" open={modalShow} footer={null} onCancel={() => setModalShow(false)}>
                    <Form style={{ marginTop: 20 }} form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
                        <Form.Item name="className" label="班级名称" rules={[{ required: true, message: "班级名称不能为空" }]}>
                            <Input></Input>
                        </Form.Item>
                        <Form.Item name="grade" label="年级" rules={[{ required: true, message: "年级不能为空" }]}>
                            <Input></Input>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 4 }}>
                            <Button type='primary' onClick={() => insertData()}>提交</Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </Content>
            <Footer />
        </Layout >
    )
}
