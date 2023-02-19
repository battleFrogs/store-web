import { Layout, theme } from 'antd';
import React from 'react';


export default function Header() {

  const { token: { colorBgContainer } } = theme.useToken();

  return (
    <Layout.Header
      style={{
        padding: 0,
        background: colorBgContainer,
      }}
    />
  )
}
