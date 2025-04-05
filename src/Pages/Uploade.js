import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from "../Components/Button";
import Card from "../Components/Card";
import Input from "../Components/Input";
import CardContent from "../Components/CardContent";
import api from '../api';

export default function UploadExcel() {
    const [file, setFile] = useState(null);
    const [tableName, setTableName] = useState("");
    const [uploadMessage, setUploadMessage] = useState("");

    const handleFileChange = (e) => setFile(e.target.files[0]);
    const handleTableNameChange = (e) => setTableName(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !tableName) {
            toast.error("Please provide both a file and table name.");
            setUploadMessage("Please provide both a file and table name.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("table_name", tableName);

        try {
            const response = await api.post("/api/upload", formData);
            console.log("Upload response:", response.data); // Debug log
            // If response status is 200, consider it a success.
            if (response.status === 200) {
                toast.success("File is uploaded successfully");
                setUploadMessage("File is uploaded successfully");
            } else {
                toast.error("File did not upload");
                setUploadMessage("File did not upload");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("File did not upload");
            setUploadMessage("File did not upload");
        }
    };

    return (
        <Card className="p-4 max-w-md mx-auto mt-10">
            <CardContent>
                <h1 className="text-xl font-bold mb-4">Upload Excel File</h1>
                <form onSubmit={handleSubmit}>
                    <Input type="file" accept=".xlsx" onChange={handleFileChange} className="mb-2" />
                    <Input 
                        type="text" 
                        placeholder="Enter table name" 
                        value={tableName} 
                        onChange={handleTableNameChange} 
                        className="mb-2"
                    />
                    <Button type="submit">Upload</Button>
                </form>
                {uploadMessage && (
                    <p className="mt-4 text-center font-bold">{uploadMessage}</p>
                )}
            </CardContent>
        </Card>
    );
}
