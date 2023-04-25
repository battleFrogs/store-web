import { Form, Table } from 'antd';
import React from 'react';

export default function EditTableAll(props) {

    const { columns, dataSource, formTable } = props

    // 对行的单元格设置编辑属性
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => {
                return {
                    record,
                    inputType: col.inputType,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: true,
                }
            },
        };
    });


    const EditableCellAll = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
    }) => {
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={["table", record.id, dataIndex]}
                        style={{
                            margin: 0,
                        }}
                        required
                    >
                        {inputType}
                    </Form.Item>
                ) : (
                    children
                )
                }
            </td >
        );
    };

    return (
        <div>
            <Form form={formTable} component={false}>
                <Table pagination={false} columns={mergedColumns} bordered={true} dataSource={dataSource} components={{ body: { cell: EditableCellAll, } }}></Table>
            </Form>
        </div>
    )
}
