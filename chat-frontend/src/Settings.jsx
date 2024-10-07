import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { getFolders, uploadFile, getFiles, deleteFile } from './api';
import './Settings.css';


const Settings = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]); 
  const [selectedFolder, setSelectedFolder] = useState('');
  const [newFolder, setNewFolder] = useState(''); 
  const [createNewFolder, setCreateNewFolder] = useState(false); 
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // State for confirmation dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [folderToDeleteFrom, setFolderToDeleteFrom] = useState(null);

  useEffect(() => {
    fetchFiles();
    fetchFolders();
  }, []);

  const handleFileDeleteClick = (fileName, folderName) => {
    setFileToDelete(fileName);
    setFolderToDeleteFrom(folderName);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (fileToDelete && folderToDeleteFrom) {
        await deleteFile(folderToDeleteFrom, fileToDelete);
        toast.success('File deleted successfully!');
        fetchFiles(); 
        setIsDialogOpen(false); 
        setFileToDelete(null);
        setFolderToDeleteFrom(null);
      }
    } catch (error) {
      toast.error('Failed to delete file. Please try again.');
    }
  };

  const handleCancelDelete = () => {
    setIsDialogOpen(false);
    setFileToDelete(null);
    setFolderToDeleteFrom(null);
  };

  // Fetch folders from the backend
  const fetchFolders = async () => {
    try {
      const fetchedFolders = await getFolders();
      setFolders(fetchedFolders.folders);
    } catch (error) {
      toast.error('Failed to fetch folders.');
    }
  };

  const fetchFiles = async () => {
    try {
      const fetchedFiles = await getFiles();
      setFiles(fetchedFiles.files);
    } catch (error) {
      toast.error('Failed to fetch files. Please try again.');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file before uploading.');
      return;
    }
  
    const folderToUpload = createNewFolder ? newFolder : selectedFolder;
  
    if (!folderToUpload) {
      toast.error('Please select or create a folder.');
      return;
    }
  
    try {
      for (const file of selectedFiles) {
        await uploadFile(file, folderToUpload, createNewFolder); // Pass folder and new folder flag
      }
      toast.success('Files uploaded successfully!');
      setSelectedFiles([]);
      fetchFiles();
      fetchFolders(); // Refresh folder list in case a new folder was created
    } catch (error) {
      console.error("Error uploading files: ", error);
      toast.error('Failed to upload files. Please try again.');
    }
  };
  

  const handleCancelUpload = () => {
    setSelectedFiles([]);
    toast.info('File upload canceled.');
  };

  const handleFileDelete = async (fileName, folderName) => { // Accept folderName as an argument
    if (!fileName || !folderName) { // Check both fileName and folderName
        toast.error('Please select a file and folder to delete.');
        return;
    }

    try {
        console.log(`Attempting to delete file: ${fileName} from folder: ${folderName}`);
        await deleteFile(folderName, fileName); // Pass folder and file name to delete API
        toast.success('File deleted successfully!');
        fetchFiles(); // Refresh the file list after deletion
    } catch (error) {
        console.error("Error deleting file: ", error);
        toast.error('Failed to delete file. Please try again.');
    }
};

  return (
    <div className="settings-page">
      <ToastContainer />
      <div className="folder-select">
  <label htmlFor="folder">Select Folder:</label>
  <select
    id="folder"
    value={createNewFolder ? '' : selectedFolder}
    onChange={(e) => setSelectedFolder(e.target.value)}
    disabled={createNewFolder}
  >
    <option value="" disabled>Select a folder</option>
    {folders.map((folder) => (
      <option key={folder} value={folder}>
        {folder}
      </option>
    ))}
  </select>

  <div className="new-folder">
    <input 
      type="checkbox" 
      id="createNewFolder" 
      checked={createNewFolder} 
      onChange={(e) => setCreateNewFolder(e.target.checked)} 
    />
    <label htmlFor="createNewFolder">Create New Folder</label>
  </div>

  {createNewFolder && (
    <input 
      type="text" 
      placeholder="Enter new folder name"
      value={newFolder}
      onChange={(e) => setNewFolder(e.target.value)} 
    />
  )}
</div>

      <div
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        {selectedFiles.length > 0 ? (
          selectedFiles.map((file, index) => <p key={index}>{file.name}</p>)
        ) : (
          <p>Drag and drop files here or click to select</p>
        )}
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      <div className="button-group">
        <button onClick={handleFileUpload}>Upload</button>
        {selectedFiles.length > 0 && (
          <button onClick={handleCancelUpload}>Cancel Upload</button>
        )}
      </div>

      <h2>Knowledge Base</h2>
      <div className="file-list-container"> {/* Scrollable container */}
    {files && Object.keys(files).length > 0 ? (
        Object.keys(files).map((folder, index) => (
            <div key={index}>
                <h3>{folder}</h3>
                  <ul>
                      {files[folder].map((fileObj, idx) => (
                  <li key={idx}>
                    <a href={fileObj.url} target="_blank" rel="noopener noreferrer">
                        {fileObj.file}
                    </a>
                          <button className="trash-icon" onClick={() => handleFileDeleteClick(fileObj.file, folder)}>Delete</button>
                      </li>
                  ))}
              </ul>
            </div>
        ))
    ) : (
        <p>No files found.</p>
    )}
</div>

    {/* Delete Confirmation Dialog */}
    {isDialogOpen && (
    <>
        <div className="backdrop" onClick={handleCancelDelete}></div>
        <div className="dialog">
            <div className="dialog-content">
                <h3>Confirm Delete</h3>
                <p>Are you sure you want to delete the file "{fileToDelete}"?</p>
                <div className="dialog-actions">
                    <button className="confirm-button" onClick={handleConfirmDelete}>Yes, Delete</button>
                    <button className="cancel-button" onClick={handleCancelDelete}>Cancel</button>
                </div>
            </div>
        </div>
    </>
)}
    </div>
  );
};

export default Settings;
