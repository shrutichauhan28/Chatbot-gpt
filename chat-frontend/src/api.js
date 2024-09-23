import axios from 'axios';

export const queryAPI = async (session_id, text, llm_name, collection_name) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/query', {
      session_id: '2c2cae75-51d4-4f12-bdae-321f702cfdcb',
      text: text,
      llm_name: llm_name,
      collection_name: collection_name
    });

    return response.data;
  } catch (error) {
    console.error("Error querying API: ", error);
    throw error;
  }
};
