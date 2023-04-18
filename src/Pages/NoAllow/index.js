import { PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Form, Input, Layout, Select, theme, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react';
import Footer from '../../Components/Footer';
import Header from '../../Components/Header/index';
import request, { baseURL } from '../../Config/request';
import { uploadUrl } from '../../Requests/FileApi';
import { getSystemUserInfoUrl, updateSystemUserInfoUrl } from '../../Requests/UserApi';


const { Content } = Layout

export default function NoAllow() {


    return (
        <div>暂无权限</div>
    )
}
