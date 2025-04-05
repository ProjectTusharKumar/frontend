import React from 'react';
import axios from 'axios';
const UploadEmployee = () => {
    const handleUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      const formData = new FormData();
      formData.append('file', file);
  
      await axios.post('/api/employees/upload', formData);
      alert('Employee data updated!');
    };
  
    return (
      <div>
        <input type="file" onChange={handleUpload} />
      </div>
    );
  };
  
  export default UploadEmployee;
  