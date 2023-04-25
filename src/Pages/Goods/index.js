import { MinusCircleOutlined } from '@ant-design/icons';
import { Button, Card, Form, Image, Input, InputNumber, Space, Switch, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState } from 'react';
import EditTableAll from '../../Components/EditTableAll/EditTableAll';
import './index.css';
import { baseURL } from '../../Config/request';
import { uploadUrl } from '../../Requests/FileApi';



const { TextArea } = Input;


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

    const [dataSource, setDataSource] = useState([])
    const [goodsImgUrl, setGoodsImgUrl] = useState("")

    const [baseForm] = useForm()
    const [detailForm] = useForm()
    const [formTable] = useForm()

    const onSubmit = (values) => {
        let index = 0
        let resultList = []
        let result = []
        values['list1'].forEach(res => {
            let res1List = res.level2List.map(res1 => {
                return res1['level2Input']
            })
            resultList.push(res1List)
        })

        let size = 0
        let sku = resultList[0]
        for (let i = 0; i < sku.length; i++) {
            let resultName = ""
            const name = sku[i];
            resultName += name
            let flag = getNextSku(resultName, size + 1);
            if (!flag) {
                result.push({
                    'id': index,
                    'skuName': resultName,
                    'num': 1,
                    'price': 0.01
                });
                index++;
            }

        }

        // 递归获取下一个sku信息
        function getNextSku(resultName, size) {
            let sku1 = resultList[size];
            if (sku1 && sku1.length > 0) {
                for (let j = 0; j < sku1.length; j++) {
                    let resultName1 = "";
                    const name1 = sku1[j];
                    if (size == 0) {
                        resultName1 += name1
                    } else {
                        resultName1 += resultName + "," + name1;
                    }
                    let flag = getNextSku(resultName1, size + 1)
                    if (!flag) {
                        result.push({
                            'id': index,
                            'skuName': resultName1,
                            'num': 1,
                            'price': 0.01
                        });
                        index++;
                    }
                }
                return true
            }
            return false
        }

        setDataSource(result)
        formTable.setFieldsValue({ table: result })
    }

    const changeImage = (info) => {
        if (info.file.status === 'done') {
            setGoodsImgUrl(info.file.response.data)
            baseForm.setFieldValue("picture", info.file.response.data)
        }
    }

    return (
        <div>
            <span>基本信息</span>
            <div style={{ marginTop: 20 }}></div>
            <Card bordered={true}>
                <Form form={baseForm} wrapperCol={{ span: 4 }} labelCol={{ span: 2 }} >
                    <Form.Item label="商品名称" name="goodsName" rules={[{ required: true, message: "商品名称必传递" }]}>
                        <Input></Input>
                    </Form.Item>
                    <Form.Item label="商品描述" name="description" rules={[{ required: true, message: "商品描述必传递" }]}>
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label="是否上架" name="onSelf" rules={[{ required: true, message: "是否上架参数必传递" }]}>
                        <Switch></Switch>
                    </Form.Item>
                    <Form.Item label="商品图片" name="picture" rules={[{
                        validator: () => {
                            if (!goodsImgUrl) { return Promise.reject("商品图片必穿") }
                        }
                    }]}>
                        {goodsImgUrl ? <div style={{ display: "inline", marginRight: 20 }}><Image width={80} src={goodsImgUrl} ></Image></div> : <></>}
                        <Upload action={baseURL + uploadUrl} onChange={changeImage}
                            onRemove={(file) => { setGoodsImgUrl(""); baseForm.setFieldValue("picture", "") }}>
                            <Button type='primary'>上传</Button>
                        </Upload>
                    </Form.Item>

                </Form>
            </Card>

            <div style={{ marginTop: 20 }}></div>
            <span>规格信息</span>
            <div style={{ marginTop: 20 }}></div>
            <Card>
                <Form form={detailForm} onFinish={onSubmit} >
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
                    <EditTableAll columns={columns} dataSource={dataSource} formTable={formTable} />
                </Form>
            </Card>
            <div style={{ marginTop: 20 }}></div>
            <Card ><Button type='primary' onClick={async () => { baseForm.validateFields(); console.log(baseForm.getFieldsValue()) }}>创建商品</Button></Card>
        </div >
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
