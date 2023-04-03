import { Breadcrumb, Button, Form, Input, InputNumber, Layout, Space, Table, theme, Modal, Popconfirm, Pagination, Select, Upload } from 'antd';
import React, { useEffect, useState } from 'react';


import Footer from '../../../Components/Footer';
import Header from '../../../Components/Header';
import request, { baseURL } from '../../../Config/request';
import { getClassesList } from '../../../Requests/ClassesApi';
import { deleteOneStudentUrl, getPageStudentUrl, insertStudentUrl, updateStudentUrl, exportExcelStudentUrl, importExcelStudentUrl } from '../../../Requests/StudentApi';


const { Content } = Layout;


export default function Student() {

  // 表格字段内容
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      editable: true,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: '20%',
      editable: true,
    },
    {
      title: '学号',
      dataIndex: 'number',
      key: 'number',
      width: '20%',
      editable: true,
    },
    {
      title: '班级',
      dataIndex: 'classId',
      key: 'classId',
      width: '20%',
      editable: true,
      render: (_, record) => {
        return record.className
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              onClick={() => save(record.id)}
              style={{
                marginRight: 8,
              }}
            >
              保存
            </Button>
            <Popconfirm title="确定取消嘛" onConfirm={() => setEditingKey('')}>
              <Button>取消</Button>
            </Popconfirm>
          </span>
        ) : (
          <Space size='small'>
            <Button onClick={() => edit(record)}>
              编辑
            </Button>
            <Button type='primary' onClick={() => deleteById(record.id)}>
              删除
            </Button>
          </Space>
        );
      }
    },
  ];

  // 对行的单元格设置编辑属性
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => {
        let inputType = "text";
        if (col.dataIndex === 'age' || col.dataIndex === 'number') {
          inputType = 'number'
        }
        if (col.dataIndex === 'classId') {
          inputType = "select"
        }
        return {
          record,
          inputType,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }
      },
    };
  });


  // 表格数据
  const [dataSource, setDataSource] = useState([])

  const { token: { colorBgContainer } } = theme.useToken();
  const [editingKey, setEditingKey] = useState('');

  const [form] = Form.useForm();
  const [formInsert] = Form.useForm();
  const [formTable] = Form.useForm();
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSizeTotal, setPageSizeTotal] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classOptions, setClassOptions] = useState([])

  // 获取列表详情数据
  const getTableList = async (pageIndexParam) => {
    let data = form.getFieldsValue()
    console.log(data)
    const filteredObj = Object.fromEntries(
      Object.entries(data)
        .filter(([key, value]) => value)
    );
    request.postJson(getPageStudentUrl, { pageIndex: pageIndexParam, pageSize: 10 }, filteredObj)
      .then((res) => { setDataSource(res.students); setPageSizeTotal(res.total) })
  }

  // 修改分页数据
  const changePage = (page) => {
    setPageIndex(page)
    getTableList(page)
  }

  useEffect(() => {
    getTableList(pageIndex)
    request.get(getClassesList, {}).then((res) => {
      if (res.length > 0) {
        const resObj = res.map((item) => {
          return { label: item.className, value: item.id }
        })
        setClassOptions(resObj)
      }
    })
  }, [])

  // 展示表格那行是否可编辑的状态
  const isEditing = (record) => record.id === editingKey;
  const edit = (record) => {
    formTable.setFieldsValue({
      name: '',
      age: '',
      number: '',
      className: '',
      ...record,
    });

    setEditingKey(record.id);
  };

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {

    let inputNode = <Input />;
    if (inputType === 'number') {
      inputNode = <InputNumber />
    }
    if (inputType === 'select') {
      inputNode = <Select options={classOptions} />
    }
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `请输入 ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  // 修改该行的修改内容
  const save = async (key) => {
    try {
      console.log(formTable.getFieldsValue())
      await formTable.validateFields()
      await request.postJson(updateStudentUrl, { id: key }, formTable.getFieldsValue())
      getTableList(pageIndex)
      setEditingKey('');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  // 查询表单内容
  const submit = () => {
    setPageIndex(1)
    getTableList(pageIndex)
  }

  // 清空表单内容
  const clear = () => {
    form.resetFields()
    setPageIndex(1)
    getTableList(pageIndex)
  }

  // 新增数据
  const insert = async () => {
    await formInsert.validateFields()
    const data = formInsert.getFieldsValue()
    console.log(data)
    if (data['name'] && data['age'] && data['number'] && data['classId']) {
      await request.postJson(insertStudentUrl, {}, data)
      setIsModalOpen(false)
      getTableList(pageIndex)
    }
  }

  // 删除数据
  const deleteById = (id) => {
    request.get(deleteOneStudentUrl, { id }).then((res) => getTableList(pageIndex))
  }

  // 导出
  const exportExcel = () => {
    let data = form.getFieldsValue()
    const filteredObj = Object.fromEntries(
      Object.entries(data)
        .filter(([_, value]) => value)
    );
    request.postExport(exportExcelStudentUrl, { pageIndex, pageSize: 10 }, filteredObj)
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
              <Button type="primary" onClick={() => setIsModalOpen(true)}>新增</Button>
              <Button type="dashed" onClick={() => exportExcel()}>导出</Button>
              <Upload action={baseURL + importExcelStudentUrl} fileList={null} headers={{ 'Authorization': sessionStorage.getItem("token") }}><Button type="primary" >导入</Button></Upload>
            </Space>
          </Form>
          <div style={{ marginTop: 30 }}></div>
          <Form form={formTable} component={false}>
            <Table columns={mergedColumns} bordered dataSource={dataSource}
              pagination={false}
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              scroll={{ x: 'max-content', y: 400 }}
            ></Table>
          </Form>
          <div style={{ marginTop: 30 }}></div>
          <div style={{ textAlign: 'end' }}>
            <Pagination defaultCurrent={1} defaultPageSize={10} total={pageSizeTotal} pageSizeOptions={['10']} hideOnSinglePage={true}
              onChange={(page) => changePage(page)} />
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
              <Form.Item name="number" label="学号" rules={[{ required: true, message: "学号不能为空" }]}>
                <InputNumber />
              </Form.Item>
              <Form.Item name="classId" label="班级" rules={[{ required: true, message: "班级不能为空" }]}>
                <Select options={classOptions}></Select>
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
