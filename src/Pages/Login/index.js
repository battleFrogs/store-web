import React from 'react'

import { Button, Checkbox, Form, Input, Space } from 'antd';
import './index.css'
import request from '../../Config/request';
import { getSystemUserInfoUrl, loginUrl } from "../../Requests/UserApi"
import { useNavigate } from 'react-router-dom';
export default function Login() {


    let navigate = useNavigate();

    const onFinish = (values) => {
        request.postJson(loginUrl, {}, values).then((res) => {
            // 存储token信息
            sessionStorage.setItem("token", res)
            request.postJson(getSystemUserInfoUrl, {}, {}).then((res) => {
                sessionStorage.setItem("identity", res.identity)
                navigate("/page/home");
            })
        })
    };

    return (



        <div className='background'>
            <div className='window'>
                <Form
                    name="basic"
                    labelCol={{
                        span: 7,
                    }}
                    wrapperCol={{
                        span: 13,
                    }}
                    style={{
                        marginTop: 100
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="remember"
                        valuePropName="checked"
                        wrapperCol={{
                            offset: 7,
                            span: 16,
                        }}
                    >
                        <Checkbox>记住我</Checkbox>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 7,
                            span: 16,
                        }}
                    >
                        <Space size='middle'>
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                            <Button type="default" onClick={() => navigate("/register")} >
                                注册
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
