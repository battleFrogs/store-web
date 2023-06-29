import { Button, Form, Input } from 'antd';
import React from 'react';



export default function NoAllow() {

    const onFinish = (values) => {
        console.log(values)
    }

    return (
        <div>
            <Form onFinish={onFinish} >
                <Form.Item name={["0", "name"]} label="名称1">
                    <Input></Input>
                </Form.Item>
                <Form.Item name={["0", "age"]} label="学校1">
                    <Input></Input>
                </Form.Item>
                <Form.Item name={["1", "name"]} label="名称2">
                    <Input></Input>
                </Form.Item>
                <Form.Item name={["1", "age"]} label="学校2">
                    <Input></Input>
                </Form.Item>
                <Button type='primary' htmlType='submit'>按钮</Button>
            </Form>
        </div>
    )
}
