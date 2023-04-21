import { Button, Card, Form, Input, InputNumber, Space, Switch, Table, Upload } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form'
import React, { useState } from 'react'
import './index.css'
import EditTable from '../../Components/EditTable/EditTable';

export default function Goods() {

    const columns = [
        {
            title: '商品规格',
            dataIndex: 'skuName',
            key: 'skuName',
            width: '20%',
            inputType: <Input disabled={true} style={{ width: 200 }}></Input>,
            editable: true
        },
        {
            title: '库存',
            dataIndex: 'num',
            key: 'num',
            width: '20%',
            inputType: <InputNumber></InputNumber>,
            editable: true
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            width: '20%',
            inputType: <InputNumber min="0"
                max="100"
                step="0.01"></InputNumber>,
            editable: true
        },
    ]

    const [dataSource, setDataSource] = useState([
        {
            skuName: "规格1",
            num: 10,
            price: 100
        }
    ])


    const [baseForm] = useForm()
    const [detailForm] = useForm()
    const [formTable] = useForm()

    const onSubmit = (values) => {
        let data = []
        let index = 0
        values['list1'].forEach(res => {
            let name = res.level1Input
            let level2List = res.level2List
            level2List.forEach(level2 => {
                let obj = {}
                obj['id'] = index
                obj['skuName'] = name + level2.level2Input
                obj['num'] = 1
                obj['price'] = 0.01
                data.push(obj)
                index++
            })
        })
        console.log(data)
        setDataSource(data)
        console.log({ table: data })
        formTable.setFieldsValue({ table: data })
    }

    const onError = ({ errorFields }) => [
        console.log(errorFields)
    ]

    return (
        <div>
            <span>基本信息</span>
            <div style={{ marginTop: 20 }}></div>
            <Card bordered={true}>
                <Form form={baseForm} wrapperCol={{ span: 4 }} labelCol={{ span: 2 }} >
                    <Form.Item label="商品名称" name="goodsName" required>
                        <Input></Input>
                    </Form.Item>
                    <Form.Item label="商品库存" name="stock" required>
                        <InputNumber></InputNumber>
                    </Form.Item>
                    <Form.Item label="是否上架">
                        <Switch></Switch>
                    </Form.Item>
                    <Form.Item label="商品图片">
                        <Upload>
                            <Button type='primary'>上传</Button>
                        </Upload>
                    </Form.Item>

                </Form>
            </Card>

            <div style={{ marginTop: 20 }}></div>
            <span>规格信息</span>
            <div style={{ marginTop: 20 }}></div>
            <Card>
                <Form form={detailForm} onFinish={onSubmit} onFinishFailed={onError}>
                    <Form.List name={['list1']} >
                        {(fields, { add, remove }, { errors }) => (
                            <>
                                {fields.map((field, index) => {
                                    return <>
                                        <Form.Item key={field.key} label="规格名称" >
                                            <Form.Item {...field} name={[field.name, 'level1Input']} rules={[{ required: true, message: "规格名称必填" }]} style={{ display: 'inline-flex', width: "200px" }}>
                                                <Input></Input>
                                            </Form.Item>
                                            <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                onClick={() => remove(field.name)} />
                                            <Form.List name={[field.name, 'level2List']} style={{ display: 'inline-flex' }} rules={[
                                                {
                                                    validator: async (_, level2List) => {
                                                        if (!level2List || level2List.length <= 0) {
                                                            return Promise.reject("至少有一个规格值")
                                                        }
                                                    }
                                                }
                                            ]}>
                                                {getSkuValueList()}
                                            </Form.List>
                                        </Form.Item>
                                        <div style={{ marginTop: 10 }}></div>
                                    </>
                                }
                                )}
                                <Space size="large">
                                    <Button type='primary' onClick={() => add()}>添加规格名称</Button>
                                    <Button type="default" htmlType='submit'>生成</Button>
                                </Space>
                            </>
                        )}
                    </Form.List>
                </Form>
                <div style={{ marginTop: 20 }}></div>
                <Form>
                    <EditTable columns={columns} dataSource={dataSource} formTable={formTable} single={false}></EditTable>
                </Form>
            </Card>
        </div>
    )

    function getSkuValueList() {
        return (fields, { add, remove }, { errors }) => (
            <div style={{ display: 'flex' }}>
                {fields.map((field, index) => {
                    let labelName = `规格值${index + 1}`;
                    return <Form.Item key={field.key} label={labelName} >
                        <Form.Item {...field} noStyle name={[field.name, 'level2Input']} rules={[{ required: true, message: "规格值必填" }]}>
                            <Input style={{
                                width: '60%',
                            }}></Input>
                        </Form.Item>
                        <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => remove(field.name)} />
                    </Form.Item>;
                }
                )}
                <Form.Item>
                    {fields.length >= 3 ? null : <Button type='dashed' onClick={() => add()}>设置规格值</Button>}
                    <Form.ErrorList errors={errors} />
                </Form.Item>
            </div>
        );
    }
}
