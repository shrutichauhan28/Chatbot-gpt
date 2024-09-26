import React, { useState, useEffect, useRef } from 'react'; 
import { toast } from 'react-toastify';
import { uploadFile, getFiles, deleteFile } from './api';
import './Settings.css';

const Settings = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);  // To store selected files
  const [files, setFiles] = useState([]);                  // To display already uploaded files
  const [isDragging, setIsDragging] = useState(false);     // To indicate drag state
  const fileInputRef = useRef(null);                       // Hidden file input reference

  useEffect(() => {
    fetchFiles();  // Fetch uploaded files on component mount
  }, []);

  // Fetch files from the server
  const fetchFiles = async () => {
    try {
      const fetchedFiles = await getFiles();
      setFiles(fetchedFiles.files);
    } catch (error) {
      toast.error('Failed to fetch files. Please try again.');
    }
  };

  // Handle drag over event
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  // Handle drag leave event
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Handle file drop event
  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const filesDropped = Array.from(event.dataTransfer.files); // Get dropped files
    setSelectedFiles((prevFiles) => [...prevFiles, ...filesDropped]); // Add dropped files to state
  };

  // Handle file input change event (when files are selected from the file explorer)
  const handleFileChange = (event) => {
    const filesSelected = Array.from(event.target.files); // Get files from input
    setSelectedFiles((prevFiles) => [...prevFiles, ...filesSelected]); // Add selected files to state
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file before uploading.');
      return;
    }

    try {
      for (const file of selectedFiles) {
        await uploadFile(file); // Upload each file
      }
      toast.success('Files uploaded successfully!');
      setSelectedFiles([]); // Clear selected files
      fetchFiles();         // Fetch updated list of files after upload
    } catch (error) {
      console.error("Error uploading files: ", error);
      toast.error('Failed to upload files. Please try again.');
    }
  };

  // Handle file delete
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

  // Trigger file explorer when the drag/drop area is clicked
  const handleUploadAreaClick = () => {
    fileInputRef.current.click(); // Trigger hidden input click
  };

  // Handle canceling the file upload
  const handleCancelUpload = () => {
    setSelectedFiles([]); // Clear selected files
    toast.info('File upload canceled.');
  };

  return (
    <div className="settings-page">
      <div 
        className={`upload-area ${isDragging ? 'dragging' : ''}`} 
        onDragOver={handleDragOver} 
        onDragLeave={handleDragLeave} 
        onDrop={handleDrop}
        onClick={handleUploadAreaClick} // Click to open file explorer
      >
        {selectedFiles.length > 0 ? (
          selectedFiles.map((file, index) => <p key={index}>{file.name}</p>) // Show selected files
        ) : (
          <p>Drag and drop files here or click to select</p> // Placeholder text
        )}
        <input
          type="file"
          multiple
          ref={fileInputRef} // Reference to the hidden input
          onChange={handleFileChange} // Handle file selection
          style={{ display: 'none' }} // Hide input
        />
      </div>

      {/* Upload/Cancel buttons */}
      <div className="button-group">
        <button onClick={handleFileUpload}>Upload</button>
        {selectedFiles.length > 0 && <button onClick={handleCancelUpload}>Cancel Upload</button>}
      </div>

      {/* Display the list of uploaded files */}
      <h2>List of Files</h2>
      <ul>
        {files.length > 0 ? (
          files.map((fileObj, index) => (
            <li key={index}>
              <a href={fileObj.url} target="_blank" rel="noopener noreferrer">{fileObj.file}</a>
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
