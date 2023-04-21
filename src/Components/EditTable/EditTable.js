import { Form, Table } from 'antd';
import React from 'react';

export default function EditTable(props) {

    const { columns, dataSource, editingKey, formTable, single } = props
    const isEditing = (record) => {
        if (!editingKey) {
            return true
        }
        return record.id === editingKey
    };

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
                    editing: isEditing(record),
                }
            },
        };
    });

    // td单元格修改的样式
    const EditableCell = ({
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
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        required
                    >
                        {inputType}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

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
                <Table columns={mergedColumns} bordered={true} dataSource={dataSource} components={{ body: { cell: single ? EditableCell : EditableCellAll, } }}></Table>
            </Form>
        </div>
    )
}
