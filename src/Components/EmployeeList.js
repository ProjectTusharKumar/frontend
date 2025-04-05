import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import api from '../api';

const EditableTable = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [data, setData] = useState([]); // generic data for any table
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  // const navigate = useNavigate();

  // State for inline editing
  const [editingRow, setEditingRow] = useState(null);
  const [editData, setEditData] = useState({});

  // Fixed columns definition (keys should be in lowercase)
  const fixedColumns = [
    { header: 'name', key: 'name' },
    { header: 'dob', key: 'dob' },
    { header: 'Phone No', key: 'phone no' },
    { header: 'skills', key: 'skills' },
    { header: 'doj', key: 'doj' },
    { header: 'salary', key: 'salary' },
    { header: 'attendance last year', key: 'attendance last year' },
    { header: 'projects completed', key: 'projects completed' },
    { header: 'projects currently on', key: 'projects currently on' },
    { header: 'past projects', key: 'past projects' }
  ];

  // Fetch available table names on mount
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await api.get('/api/tables');
        setTables(response.data.tables);
        if (response.data.tables.length > 0) {
          setSelectedTable(response.data.tables[0]);
        }
      } catch (error) {
        toast.error('Failed to fetch table names');
      }
    };
    fetchTables();
  }, []);

  // Fetch table data whenever the selected table changes
  useEffect(() => {
    if (selectedTable) {
      fetchData();
      setEditingRow(null); // Reset editing mode when table changes
    }
  }, [selectedTable]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/table_data?name=${selectedTable}`);
      // Normalize keys to lowercase for consistent lookup
      const normalizedData = response.data.data.map(row =>
        Object.keys(row).reduce((acc, key) => {
          acc[key.toLowerCase()] = row[key];
          return acc;
        }, {})
      );
      setData(normalizedData);
    } catch (error) {
      toast.error('Failed to fetch table data');
    } finally {
      setLoading(false);
    }
  };

  // Dynamic search: check if any field in the row contains the search term
  const filteredData = data.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const offset = currentPage * itemsPerPage;
  const currentData = filteredData.slice(offset, offset + itemsPerPage);

  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  // Inline editing handlers
  const handleEditClick = (row) => {
    setEditingRow(row.id);
    setEditData({ ...row });
  };

  const handleEditChange = (e, field) => {
    setEditData({ ...editData, [field]: e.target.value });
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditData({});
  };

  const handleSaveEdit = async (id) => {
    if (!id) {
      toast.error("Record id is undefined.");
      return;
    }
    setLoading(true);
    try {
      await api.put(`/api/table_data?name=${selectedTable}&id=${id}`, editData);
      toast.success('Record updated successfully');
      setEditingRow(null);
      setEditData({});
      fetchData();
    } catch (error) {
      toast.error('Failed to update record');
    } finally {
      setLoading(false);
    }
  };

  // Delete function using dynamic endpoint
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/api/table_data?name=${selectedTable}&id=${id}`);
      toast.success('Record deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete record');
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this record?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(id);
      },
    });
  };

  return (
    <div className="container mt-4">
      <h2>Table Data: {selectedTable}</h2>

      {/* Table Selection Dropdown */}
      <div className="mb-3">
        <label htmlFor="tableSelect" className="form-label">
          Select Table
        </label>
        <select
          id="tableSelect"
          className="form-select"
          value={selectedTable}
          onChange={(e) => {
            setSelectedTable(e.target.value);
            setCurrentPage(0); // Reset pagination on table change
            setEditingRow(null);
          }}
        >
          {tables.map((table, index) => (
            <option key={index} value={table}>
              {table}
            </option>
          ))}
        </select>
      </div>

      {/* Search Input */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <div className="text-center">
          <ClipLoader color="#3498db" size={50} />
        </div>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              {fixedColumns.map((col, index) => (
                <th key={index}>{col.header}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row) => (
              <tr key={row.id}>
                {fixedColumns.map((col, index) => (
                  <td key={index}>
                    {editingRow === row.id ? (
                      <input
                        type="text"
                        value={editData[col.key] || ''}
                        onChange={(e) => handleEditChange(e, col.key)}
                      />
                    ) : (
                      row[col.key]
                    )}
                  </td>
                ))}
                <td>
                  {editingRow === row.id ? (
                    <>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => handleSaveEdit(row.id)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-primary me-2"
                        onClick={() => handleEditClick(row)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => showDeleteConfirm(row.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ReactPaginate
        previousLabel="← Previous"
        nextLabel="Next →"
        pageCount={Math.ceil(filteredData.length / itemsPerPage)}
        onPageChange={handlePageClick}
        containerClassName="pagination"
        activeClassName="active"
      />
    </div>
  );
};

export default EditableTable;
