import { Drawer, Image, Space, Switch, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import request from '../../../Config/request';
import { getGoodsList } from '../../../Requests/GoodsApi';

export default function GoodsList() {

    const [dataSource, setDataSource] = useState([])
    const [selectionType, setSelectionType] = useState('checkbox');
    const [open, setOpen] = useState(false);


    useEffect(() => {
        request.postJson(getGoodsList, { pageIndex: 1, pageSize: 10 }, {}).then(res => {
            setDataSource(res.goodsDetailVOList)
        })
    }, [])

    const columns = [
        {
            name: "goodsName",
            dataIndex: "goodsName",
            title: "商品",
            width: "20%",
            render: (text, record) => {
                return <Space size="large"><Image width={100} height={80} src={record.imgUrl}></Image>
                    <span style={{ color: "purple" }}>{text}</span>
                </Space>
            }
        },
        {
            name: "goodsDescription",
            dataIndex: "description",
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
                    <a onClick={() => setOpen(true)}>详情</a>
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
            <Drawer title="Basic Drawer" placement="right"  onClose={() => setOpen(false)} open={open}>
                <p>Some contents...</p>
            </Drawer>
        </div>
    )
}
