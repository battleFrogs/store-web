import { Breadcrumb, Button, Form, Input, InputNumber, Layout, Space, Table, theme, Modal } from 'antd';
import React, { useState } from 'react';


import Footer from '../../../Components/Footer';
import Header from '../../../Components/Header';
import request from '../../../Config/request';


const { Content } = Layout;


export default function Student() {

  // 表格字段内容
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '学号',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: '班级',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type='primary'>
          删除
        </Button>
      ),
    },

  ];

  // 表格数据
  const [dataSource, setDataSource] = useState([])

  const { token: { colorBgContainer } } = theme.useToken();
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 提交表单内容
  const submit = () => {
    const param = { pageIndex: 1, pageSize: 10 }
    const data = form.getFieldsValue()
    request.postJson("/student/getPageList", param, data).then((res) => setDataSource(res.records))
  }

  // 清空表单内容
  const clear = () => {
    form.resetFields()
    setDataSource([])
  }

  // 新增数据
  const insert = async () => {
    alert("sdf")
    await form1.validateFields()
    const data = form1.getFieldsValue()
    console.log(data)
    if (data['name'] && data['age'] && data['number'] && data['className']) {
      await request.postJson("/student/save", {}, data)
      handleCancel()
      const param = { pageIndex: 1, pageSize: 10 }
      request.postJson("/student/getPageList", param, {}).then((res) => setDataSource(res.records))
    }
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
          <Breadcrumb.Item>学生列表</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            padding: 24,
            minHeight: 360,
            background: colorBgContainer,
          }}
        >
          <Form form={form} layout="inline">
            <Form.Item name="name" label="姓名">
              <Input />
            </Form.Item>
            <Form.Item name="age" label="年龄">
              <InputNumber />
            </Form.Item>
            <Form.Item name="number" label="学号">
              <InputNumber />
            </Form.Item>
            <Space size="small">
              <Button type="primary" onClick={() => submit()}>查询</Button>
              <Button type="dashed" onClick={() => clear()}>清空</Button>
              <Button type="primary" onClick={showModal}>新增</Button>
            </Space>
          </Form>
          <div style={{ marginTop: 30 }}></div>
          <Table columns={columns} bordered dataSource={dataSource}></Table>

          <Modal title="新增数据" open={isModalOpen} onOk={handleOk}
            onCancel={handleCancel} bodyStyle={{ margin: 40 }} footer={null}>
            <Form form={form1} labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }} >
              <Form.Item name="name" label="姓名" rules={[{ required: true, message: "姓名不能为空" }]}>
                <Input />
              </Form.Item>
              <Form.Item name="age" label="年龄" rules={[{ required: true, message: "年龄不能为空" }]}>
                <InputNumber />
              </Form.Item>
              <Form.Item name="number" label="学号" rules={[{ required: true, message: "学号不能为空" }]}>
                <InputNumber />
              </Form.Item>
              <Form.Item name="className" label="班级" rules={[{ required: true, message: "班级不能为空" }]}>
                <Input />
              </Form.Item>
              <div style={{ textAlign: 'center' }}>
                <Button type='primary' onClick={insert}>确定新增</Button>
              </div>
            </Form>
          </Modal>
        </div>
      </Content>
      <Footer />
    </Layout>
  )
}
