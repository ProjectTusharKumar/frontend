import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { 
  DashboardOutlined, 
  TableOutlined, 
  UploadOutlined, 
  MessageOutlined,  
  TeamOutlined, 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<DashboardOutlined />} onClick={() => handleMenuClick('/')}>
          Dashboard
        </Menu.Item>
        <Menu.Item key="2" icon={<TableOutlined />} onClick={() => handleMenuClick('/table')}>
          Table
        </Menu.Item>
        <Menu.Item key="3" icon={<UploadOutlined />} onClick={() => handleMenuClick('/upload')}>
          Upload
        </Menu.Item>
        <Menu.Item key="4" icon={<MessageOutlined />} onClick={() => handleMenuClick('/chat')}>
          Chat
        </Menu.Item>

        {/* 🔥 New Links Added Below */}
        <Menu.Item key="5" icon={<TeamOutlined />} onClick={() => handleMenuClick('/employeelist')}>
          Employee List
        </Menu.Item>
        {/* <Menu.Item key="6" icon={<FormOutlined />} onClick={() => handleMenuClick('/edit/1')}>
          Edit Employee
        </Menu.Item>
        <Menu.Item key="7" icon={<UploadOutlined />} onClick={() => handleMenuClick('/upload-employees')}>
          Upload Employees
        </Menu.Item>
        <Menu.Item key="8" icon={<SettingOutlined />} onClick={() => handleMenuClick('/settings')}>
          Settings
        </Menu.Item> */}
      </Menu>
    </Sider>
  );
};

export default Sidebar;
