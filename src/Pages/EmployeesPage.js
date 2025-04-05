import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch Employees from Backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/employees');
        if (!response.ok) {
          throw new Error('Failed to fetch employee data');
        }
        const result = await response.json();
        setEmployees(result.data);
      } catch (err) {
        message.error(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // ✅ Handle Delete Confirmation
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }

      // Update UI after deletion
      setEmployees((prev) => prev.filter((employee) => employee.id !== id));
      message.success('Employee deleted successfully');
    } catch (err) {
      message.error(`Error: ${err.message}`);
    } finally {
      setDeleteConfirmVisible(false);
    }
  };

  const showDeleteConfirm = (id) => {
    setDeleteId(id);
    setDeleteConfirmVisible(true);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmVisible(false);
  };

  // ✅ Define Table Columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dob',
      key: 'dob',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Skills',
      dataIndex: 'skills',
      key: 'skills',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          {/* Edit Button */}
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/edit/${record.id}`)}
          >
            Edit
          </Button>
          {/* Delete Button */}
          <Button
            type="link"
            icon={<DeleteOutlined />}
            danger
            onClick={() => showDeleteConfirm(record.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Employee List</h2>
      <Table
        dataSource={employees}
        columns={columns}
        rowKey="id"
        loading={loading}
      />

      {/* ✅ Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        visible={deleteConfirmVisible}
        onOk={() => handleDelete(deleteId)}
        onCancel={handleCancelDelete}
        okText="Yes"
        cancelText="No"
      >
        Are you sure you want to delete this employee?
      </Modal>
    </div>
  );
};

export default EmployeeList;
