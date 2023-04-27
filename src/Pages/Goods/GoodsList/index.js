import { Image, Space, Switch, Table } from 'antd';
import React, { useEffect, useState } from 'react';

export default function GoodsList() {

    const [dataSource, setDataSource] = useState([])
    const [selectionType, setSelectionType] = useState('checkbox');


    useEffect(() => {
        setDataSource([
            {
                key: 1,
                goodsName: "商品一",
                goodsDescription: "商品描述",
                onSelf: true
            },
            {
                key: 2,
                goodsName: "xxx",
                goodsDescription: "商品描述",
                onSelf: false
            },
        ])
    }, [])

    const columns = [
        {
            name: "goodsName",
            dataIndex: "goodsName",
            title: "商品",
            width: "20%",
            render: (text, record) => {
                return <Space size="large"><Image width={100} height={80} src='http://localhost:8081/pic/20230425151844p07ue.jpeg'></Image>
                    <span style={{ color: "purple" }}>{text}</span>
                </Space>
            }
        },
        {
            name: "goodsDescription",
            dataIndex: "goodsDescription",
            title: "商品描述"
        },
        {
            name: "onSelf",
            dataIndex: "onSelf",
            title: "是否上架",
            width: "20%",
            render: (text, record) => {
                return <Switch defaultChecked={text} />
            }
        },
        {
            name: "operate",
            dataIndex: "operate",
            title: "操作",
            width: "20%",
            render: (text, record) => {
                return <Space size="small">
                    <a>编辑</a>
                    <a>删除</a>
                </Space>
            }
        },


    ]



    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
    };

    return (
        <div>
            <Table columns={columns} dataSource={dataSource} defaultSelectedRowKeys={[1]} rowSelection={{
                type: selectionType,
                ...rowSelection,
            }} />
        </div>
    )
}
