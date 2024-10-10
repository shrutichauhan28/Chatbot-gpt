import streamlit as st
import requests

# Define FastAPI URL
API_URL = "http://127.0.0.1:8000/query"

# Streamlit App Title
st.title("Document Query and Chunk Retrieval")

# Input form for the query
query_input = st.text_input("Enter your query:")

# Session ID (Optional, will be generated if not provided)
session_id = st.text_input("Session ID (Optional):")

# Select LLM Name
llm_name = st.selectbox("Select LLM:", ['openai', 'other_llm'])

# Collection Name for the vector database
collection_name = st.text_input("Collection Name:")

# Submit query to FastAPI
if st.button("Submit Query"):
    if query_input and collection_name:
        # Prepare the payload for FastAPI
        payload = {
            "text": query_input,
            "session_id": session_id if session_id else None,
            "llm_name": llm_name,
            "collection_name": collection_name
        }

        # Call FastAPI /query endpoint
        response = requests.post(API_URL, json=payload)

        if response.status_code == 200:
            result = response.json()
            st.subheader("Response and Sources")
            st.write(result['answer'])

            # st.subheader("Sources")
            # st.write(result['sources'])

            st.subheader("Ranked Chunks")
            for chunk in result['ranked_chunks']:
                st.write(f"Chunk Text: {chunk['text']}")
                st.write(f"BM25 Score: {chunk['bm25_score']}")
        else:
            st.error("Error: Unable to process the query.")
    else:
        st.error("Please enter both query and collection name.")
