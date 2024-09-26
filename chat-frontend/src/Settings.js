import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { uploadFile, getFiles, deleteFile } from './api';

const Settings = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);

  // Fetch the list of files from the server when the component mounts
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const fetchedFiles = await getFiles();
      setFiles(fetchedFiles.files); // Assuming the API returns { files: [...] }
    } catch (error) {
      toast.error('Failed to fetch files. Please try again.');
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file before uploading.');
      return;
    }

    try {
      await uploadFile(selectedFile);
      toast.success('File uploaded successfully!');
      fetchFiles(); // Fetch the updated list of files after upload
    } catch (error) {
      console.error("Error uploading file: ", error);
      toast.error('Failed to upload file. Please try again.');
    }
  };

  const handleFileDelete = async (fileName) => {
    try {
      await deleteFile(fileName);
      toast.success(`File '${fileName}' deleted successfully!`);
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file: ", error);
      toast.error('Failed to delete file. Please try again.');
    }
  };

  return (
    <div className="settings-container">
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>

      <h2>List of Files</h2>
      <ul>
        {files.length > 0 ? (
          files.map((fileObj, index) => (
            <li key={index}>
              <a href={fileObj.url} target="_blank" rel="noopener noreferrer">{fileObj.file}</a> {/* Hyperlink */}
              <button onClick={() => handleFileDelete(fileObj.file)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No files found.</p>
        )}
      </ul>
    </div>
  );
};

export default Settings;
