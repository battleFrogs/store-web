import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Form, Select, Input, InputNumber, Layout, Space, Table, theme, Modal, Popconfirm, Pagination } from 'antd';
import Footer from '../../../Components/Footer';
import Header from '../../../Components/Header';
import EditTable from '../../../Components/EditTable/EditTable';
import request from '../../../Config/request';
import { getClassesList } from '../../../Requests/ClassesApi';
import { getTeacherPageList, teacherDelete, teacherInsert, teacherUpdate } from '../../../Requests/TeacherApi';

const { Content } = Layout;

export default function Teacher() {


    useEffect(() => {
        getTeacherData();
        request.get(getClassesList, {}).then((res) => {
            if (res.length > 0) {
                const resObj = res.map((item) => {
                    return { label: item.className, value: item.id }
                })
                setClassOptions(resObj)
            }
        })
    }, [])

    const [editingKey, setEditingKey] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [classOptions, setClassOptions] = useState([])
    const [dataSource, setDataSource] = useState([])

    const [formTable] = Form.useForm();
    const [formInsert] = Form.useForm();


    const isEditing = (record) => record.teacherId === editingKey;
    const edit = (record) => {
        formTable.setFieldsValue({
            ...record,
            classId: record.classesResults.map(res => res.classId)
        })
        setEditingKey(record.teacherId);
    }
    // 编辑
    const save = async (key) => {
        await formTable.validateFields()
        let data = formTable.getFieldsValue()
        await request.postJson(teacherUpdate, {}, { ...data, id: key })
        setEditingKey('');
        getTeacherData();
    };
    // 删除数据
    const deleteById = (id) => {
        request.get(teacherDelete, { id })
        getTeacherData();
    }
    const insert = async () => {
        let data = formInsert.getFieldsValue()
        await request.postJson(teacherInsert, {}, data)
        setIsModalOpen(false)
        getTeacherData();
    }


    // 表格字段内容
    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            inputType: <Input></Input>,
            editable: true,
        },
        {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
            width: '20%',
            inputType: <InputNumber></InputNumber>,
            editable: true,
        },
        {
            title: '班级',
            dataIndex: 'classId',
            key: 'classId',
            width: '20%',
            inputType: <Select mode="multiple" options={classOptions} />,
            editable: true,
            render: (_, record) => {
                return record.classesResults.map(res => res.className).join(",")
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => {
                return isEditing(record) ? (
                    showTableAction(record)
                ) : (
                    editTableAction(record)
                );
            }
        }
    ];

    function getTeacherData() {
        request.postJson(getTeacherPageList, { pageIndex: 1, pageSize: 10 }, {}).then(res => {
            setDataSource(res.pageTeacherResults);
        });
    }

    function editTableAction(record) {
        return <Space size='small'>
            <Button onClick={() => edit(record)}>
                编辑
            </Button>
            <Button type='primary' onClick={() => deleteById(record.teacherId)}>
                删除
            </Button>
        </Space>;
    }

    function showTableAction(record) {
        return <span>
            <Button
                onClick={() => save(record.teacherId)}
                style={{
                    marginRight: 8,
                }}
            >
                保存
            </Button>
            <Popconfirm title="确定取消嘛" onConfirm={() => setEditingKey('')}>
                <Button>取消</Button>
            </Popconfirm>
        </span>;
    }


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
                    <Breadcrumb.Item>用户操作</Breadcrumb.Item>
                    <Breadcrumb.Item>教师信息</Breadcrumb.Item>
                </Breadcrumb>
                <div
                    style={{
                        padding: 24,
                        minHeight: 360,
                        background: colorBgContainer,
                    }}
                >
                    <Button type='primary' onClick={() => setIsModalOpen(true)}>新增</Button>
                    <div style={{ marginTop: 15 }}></div>

                    <EditTable columns={columns} dataSource={dataSource} editingKey={editingKey}
                        classOptions={classOptions} formTable={formTable}></EditTable>
                </div>
                <Modal title="新增数据" open={isModalOpen} onOk={() => setIsModalOpen(false)}
                    onCancel={() => setIsModalOpen(false)} bodyStyle={{ margin: 40 }} footer={null}>
                    <Form form={formInsert} labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }} >
                        <Form.Item name="name" label="姓名" rules={[{ required: true, message: "姓名不能为空" }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="age" label="年龄" rules={[{ required: true, message: "年龄不能为空" }]}>
                            <InputNumber />
                        </Form.Item>
                        <Form.Item name="classId" label="班级" rules={[{ required: true, message: "班级不能为空" }]}>
                            <Select mode='multiple' options={classOptions}></Select>
                        </Form.Item>
                        <div style={{ textAlign: 'center' }}>
                            <Button type='primary' onClick={insert}>确定新增</Button>
                        </div>
                    </Form>
                </Modal>
            </Content>
            <Footer />
        </Layout >
    )

}
