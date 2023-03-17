import { Layout, theme } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';


export default function Header() {

  const { token: { colorBgContainer } } = theme.useToken();
  let navigate = useNavigate()

  const quit = () => {
    sessionStorage.removeItem("token")
    navigate("/")
  }

  return (
    <Layout.Header
      style={{
        padding: 0,
        background: colorBgContainer,
      }}
    >
      <div style={{ textAlign: 'end', marginRight: 60 }}>
        <span onClick={() => quit()}> 退出</span>
      </div>
    </Layout.Header >
  )
}
