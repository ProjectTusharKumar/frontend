import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './Components/Layout';
import Dashboard from './Pages/Dashboard';
import Table from './Pages/Table';
import Upload from './Pages/Uploade';
import Chat from './Pages/Chat';
import EmployeeList from './Components/EmployeeList';
// import UploadEmployee from './Components/UploadEmployee';
// import EditEmployee from './Components/EditEmployee';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/table" element={<Table />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/employeelist" element={<EmployeeList />} />
        {/* <Route path="/upload" element={<UploadEmployee />} />
        <Route path="/edit/:id" element={<EditEmployee />} /> */}
      </Routes>
      {/* <ToastContainer /> */}
    </Layout>
  );
};

export default App;
