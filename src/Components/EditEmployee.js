import React, { useState,useEffect } from 'react';
import axios from 'axios';

const EditEmployee = ({ id }) => {
  const [employee, setEmployee] = useState({});

  useEffect(() => {
    axios.get(`/api/employee/${id}`).then((response) => {
      setEmployee(response.data);
    });
  }, [id]);

  const handleSubmit = async () => {
    await axios.put(`/api/employee/${id}`, employee);
    window.location.href = '/employees';
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={employee.name || ''} 
        onChange={(e) => setEmployee({ ...employee, name: e.target.value })} 
      />
      <button type="submit">Save</button>
    </form>
  );
};

export default EditEmployee;
