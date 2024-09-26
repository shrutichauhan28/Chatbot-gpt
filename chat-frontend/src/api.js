import axios from 'axios';

// Existing queryAPI function
export const queryAPI = async (session_id, text, llm_name, collection_name) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/query', {
      session_id: '2c2cae75-51d4-4f12-bdae-321f702cfdcb',
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
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

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
export const deleteFile = async (fileName) => {
  try {
    const response = await axios.delete(`http://127.0.0.1:8000/files/${fileName}`);
    return response.data; // Handle the response as needed
  } catch (error) {
    console.error("Error deleting file:", error); // Log error in console
    throw error; // Throw the error to be caught in Settings.js
  }
};
