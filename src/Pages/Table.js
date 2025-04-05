import React, { useEffect, useState } from 'react';

const API_BASE_URL = 'https://delta-ai-backend.onrender.com';

const TableManager = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [error, setError] = useState(null);
  const [loadingTables, setLoadingTables] = useState(true);

  // Fetch the list of table names when the component mounts.
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/tables`);
        if (!response.ok) {
          throw new Error('Failed to fetch table names');
        }
        const result = await response.json();
        setTables(result.tables);
        if (result.tables.length > 0) {
          setSelectedTable(result.tables[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingTables(false);
      }
    };

    fetchTables();
  }, []);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (loadingTables) return <div className="text-blue-500">Loading tables...</div>;

  return (
    <div className="p-4">
      <label htmlFor="tableSelect" >
       <div className="block mb-2 p-4 font-bold text-3xl"> Select a Table </div>
      </label>
      <select
        id="tableSelect"
        className="mb-4 p-2 border rounded"
        value={selectedTable}
        onChange={(e) => setSelectedTable(e.target.value)}
      >
        {tables.map((table, index) => (
          <option key={index} value={table}>
            {table}
          </option>
        ))}
      </select>
      {selectedTable && <TableDisplay selectedTable={selectedTable} />}
    </div>
  );
};

const TableDisplay = ({ selectedTable }) => {
  const [data, setData] = useState([]);
  const [tableName, setTableName] = useState('');
  const [error, setError] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  // Define custom column order (adjust these names as per your database columns)
  const customColumns = [
    'Name',
    'DOB',
    'Phone Number',
    'Skills',
    'DOJ',
    'Salary',
    'Attendance Last Year',
    'Projects Completed',
    'Projects Currently On',
    'Past Projects'
  ];

  // Fetch data for the selected table when it changes.
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/table?name=${encodeURIComponent(selectedTable)}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data for the selected table');
        }
        const result = await response.json();
        console.log("API result:", result); // Debug log

        // Normalize keys to lowercase for consistent lookup
        const normalizedData = result.data.map(row =>
          Object.keys(row).reduce((acc, key) => {
            acc[key.toLowerCase()] = row[key];
            return acc;
          }, {})
        );

        setData(normalizedData);
        setTableName(result.table_name);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [selectedTable]);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (loadingData) return <div className="text-blue-500">Loading data...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{tableName}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              {customColumns.map((column) => (
                <th key={column} className="border px-4 py-2">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {customColumns.map((col, colIndex) => (
                  <td key={colIndex} className="border px-4 py-2">
                    {row[col.toLowerCase()] || ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableManager;
