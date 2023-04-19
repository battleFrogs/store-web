import { Breadcrumb, Button, Form, Input, InputNumber, Layout, Space, Table, theme, Modal, Popconfirm, Pagination, Select, Upload } from 'antd';
import React, { useEffect, useState } from 'react';


import Footer from '../../../Components/Footer';
import Header from '../../../Components/Header';
import request, { baseURL } from '../../../Config/request';
import { getClassesList } from '../../../Requests/ClassesApi';
import { deleteOneStudentUrl, getPageStudentUrl, insertStudentUrl, updateStudentUrl, exportExcelStudentUrl, importExcelStudentUrl } from '../../../Requests/StudentApi';
import EditTable from '../../../Components/EditTable/EditTable';


const { Content } = Layout;


export default function Student() {


  const { token: { colorBgContainer } } = theme.useToken();
  // 表格数据
  const [dataSource, setDataSource] = useState([])
  const [editingKey, setEditingKey] = useState('');

  const [form] = Form.useForm();
  const [formInsert] = Form.useForm();
  const [formTable] = Form.useForm();
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSizeTotal, setPageSizeTotal] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classOptions, setClassOptions] = useState([])


  useEffect(() => {
    getTableList(pageIndex)
    getClassData();
  }, [])

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
      title: '学号',
      dataIndex: 'number',
      key: 'number',
      width: '20%',
      inputType: <InputNumber></InputNumber>,
      editable: true,
    },
    {
      title: '班级',
      dataIndex: 'classId',
      key: 'classId',
      width: '20%',
      editable: true,
      inputType: <Select options={classOptions} />,
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

  // 获取列表详情数据
  const getTableList = (pageIndexParam) => {
    let data = form.getFieldsValue()
    console.log(data)
    const filteredObj = Object.fromEntries(
      Object.entries(data)
        .filter(([_, value]) => value)
    );
    request.postJson(getPageStudentUrl, { pageIndex: pageIndexParam, pageSize: 10 }, filteredObj)
      .then((res) => { setDataSource(res.students); setPageSizeTotal(res.total) })
  }


  // 获取班级信息
  const getClassData = () => {
    request.get(getClassesList, {}).then((res) => {
      if (res.length > 0) {
        const resObj = res.map((item) => {
          return { label: item.className, value: item.id };
        });
        setClassOptions(resObj);
      }
    });
  }

  // 修改分页数据
  const changePage = (page) => {
    setPageIndex(page)
    getTableList(page)
  }


  // 展示表格那行是否可编辑的状态
  const isEditing = (record) => record.id === editingKey;
  const edit = (record) => {
    setEditingKey(record.id);
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
    <div>
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
        <EditTable columns={columns} dataSource={dataSource} editingKey={editingKey}
          classOptions={classOptions} formTable={formTable}></EditTable>
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
  )
}
