import axios from 'axios';

// Existing queryAPI function
export const queryAPI = async (session_id, text, llm_name, collection_name) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/query', {
      session_id,
      text: text,
      llm_name: llm_name,
      collection_name: collection_name,
    });

    return response.data;
  } catch (error) {
    console.error("Error querying API: ", error);
    throw error;
  }
};

// API call to upload file
export const uploadFile = async (file, folder, createNewFolder) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder); // Add folder to form data
  formData.append('create_new_folder', createNewFolder); // Pass flag for folder creation

  try {
    const response = await axios.post('http://127.0.0.1:8000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // Handle the response as needed
  } catch (error) {
    console.error("Error uploading file:", error); // Log error in console
    throw error; // Throw the error to be caught in Settings.js
  }
};

// API call to fetch the list of files
export const getFiles = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/files');
    return response.data; // Return the list of files
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
};

// API call to delete a file
export const deleteFile = async (folder, fileName) => {
  try {
      const response = await axios.delete('http://127.0.0.1:8000/delete', {
          data: {
              folder,
              fileName
          }
      });
      return response.data;
  } catch (error) {
      console.error("Error in API deleteFile: ", error);
      throw error;
  }
};

// Add the function to get folders from the backend
export const getFolders = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/folders'); // Assuming the backend provides folders API
    return response.data; // Return folder data from the response
  } catch (error) {
    console.error("Error fetching folders:", error);
    throw error;
  }
};

export const getLastChatSessions = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/get_last_sessions');
    return response.data; // Return the last chat sessions
  } catch (error) {
    console.error("Error fetching last chat sessions:", error);
    throw error;
  }
};