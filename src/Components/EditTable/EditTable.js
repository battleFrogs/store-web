import { Breadcrumb, Button, Form, Input, InputNumber, Select, Space, Table, theme, Modal, Popconfirm, Pagination } from 'antd';
import React, { useEffect } from 'react'

export default function EditTable(props) {

    const { columns, dataSource, editingKey, formTable } = props
    const isEditing = (record) => record.teacherId === editingKey;

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

    return (
        <div>
            <Form form={formTable} component={false}>
                <Table columns={mergedColumns} bordered={true} dataSource={dataSource} components={{ body: { cell: EditableCell, } }}></Table>
            </Form>
        </div>
    )
}
