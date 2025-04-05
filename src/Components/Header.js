import React from 'react';
import { Layout } from 'antd';

const { Header } = Layout;

const AppHeader = () => {
  return (
    <Header style={{ background: '#fff', padding: 0, textAlign: 'center', fontSize: '18px' }}>
      Employee Mangement
    </Header>
  );
};

export default AppHeader;
