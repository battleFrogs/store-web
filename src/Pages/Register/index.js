import React from 'react'

import { Button, Checkbox, Form, Input, Select, Space } from 'antd';
import './index.css'
import request from '../../Config/request';
import { registerUrl } from "../../Requests/UserApi"
import { useNavigate } from 'react-router-dom';
export default function Register() {


    let navigate = useNavigate();

    const onFinish = (values) => {
        request.postJson(registerUrl, {}, values).then((res) => {
            // 存储token信息
            navigate("/");
        })
    };


    return (



        <div className='background'>
            <div className='window'>
                <Form
                    name="register"
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
                        name="confirm"
                        label="确认密码"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: '请输入确认密码',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次密码不一致'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="identity"
                        label="身份"
                        required={true}
                    >
                        <Select options={[{ label: "学生", value: "student" }, { label: "老师", value: "teacher" }]}></Select>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 7,
                            span: 16,
                        }}
                    >
                        <Space size='middle'>
                            <Button type="primary" htmlType="submit">
                                确定注册
                            </Button>
                            <Button type="default" onClick={() => { navigate("/") }}>
                                返回登录
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
