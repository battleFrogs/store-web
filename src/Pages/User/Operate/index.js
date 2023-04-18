import { PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Form, Input, Layout, Select, theme, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react';
import Header from '../../../Components/Header/index';
import Footer from '../../../Components/Footer';
import request, { baseURL } from '../../../Config/request';
import { getSystemUserInfoUrl, updateSystemUserInfoUrl } from '../../../Requests/UserApi';
import { uploadUrl } from '../../../Requests/FileApi'


const { Content } = Layout

export default function Operate() {

    const genderOption = [{ value: 1, label: '男' }, { value: 0, label: '女' }]


    const [imgUrl, setImgUrl] = useState("")

    const { token: { colorBgContainer } } = theme.useToken();
    const [operateForm] = Form.useForm()

    useEffect(() => {
        request.postJson(getSystemUserInfoUrl, {}, {}).then((res) => {
            if (res.username) {
                operateForm.setFieldValue("username", res.username)
            }
            if (res.avatar) {
                setImgUrl(res.avatar)
            }
            if (res.gender != null) {
                operateForm.setFieldValue("gender", res.gender)
            }
            if (res.description) {
                operateForm.setFieldValue("description", res.description)
            }
        })
    }, [])

    const save = async () => {
        await operateForm.validateFields()
        const data = operateForm.getFieldsValue()
        data['avatar'] = imgUrl
        let gender = operateForm.getFieldValue("gender")

        data['gender'] = gender
        console.log(data)
        request.postJson(updateSystemUserInfoUrl, {}, data)
    }

    const handleChange = (info) => {
        if (info.file.status === 'done') {
            setImgUrl(info.file.response.data)
        }
    };

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
                    <Breadcrumb.Item>操作者信息</Breadcrumb.Item>
                </Breadcrumb>
                <div
                    style={{
                        padding: 24,
                        minHeight: 360,
                        background: colorBgContainer,
                    }}
                >
                    <Form form={operateForm} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} style={{ maxWidth: 400 }}>
                        <Form.Item label="用户名" name="username" rules={[
                            {
                                required: true,
                                message: '用户名不能为空',
                            },
                        ]}>
                            <Input></Input>
                        </Form.Item>
                        <Form.Item label="头像" name="avatar">
                            <Upload listType="picture-card" className="avatar-uploader" name="file" showUploadList={false}
                                action={baseURL + uploadUrl} onChange={handleChange}>
                                {imgUrl ? (
                                    <img
                                        src={imgUrl}
                                        alt="avatar"
                                        style={{
                                            width: '100%',
                                            height: '100%'
                                        }}
                                    />
                                ) : (
                                    <div>
                                        <PlusOutlined />
                                        <div
                                            style={{
                                                marginTop: 8,
                                            }}
                                        >
                                            Upload
                                        </div>
                                    </div>
                                )}

                            </Upload>
                        </Form.Item>
                        <Form.Item label="性别" name="gender">
                            <Select options={genderOption}>
                            </Select>
                        </Form.Item>
                        <Form.Item label="描述" name="description">
                            <TextArea showCount maxLength={500} style={{ height: 120 }}>
                            </TextArea>
                        </Form.Item>
                        <Form.Item wrapperCol={{
                            offset: 6,
                            span: 16,
                        }}>
                            <Button type='primary' onClick={() => save()}>保存</Button>
                        </Form.Item>

                    </Form>
                </div>
            </Content>
            <Footer />
        </Layout >
    )
}
