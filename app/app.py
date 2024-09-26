from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse
import os
import uuid
from dotenv import load_dotenv
from models import DocModel, QueryModel, DeleteSession
from database import create_db_and_tables
from vector_database import vector_database, db_conversation_chain
from data import load_n_split
from chat_session import ChatSession
from fastapi.staticfiles import StaticFiles
from utils import count_tokens
from fastapi.middleware.cors import CORSMiddleware
import shutil
from pathlib import Path

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allows all origins, for development. You can specify allowed origins.
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)


# Get the OpenAI API key
openai_api_key = os.getenv('OPENAI_API_KEY')

chat_session = ChatSession()

# Define the directory path where files should be saved
dir_path: str = "../data"

# Serve static files from the directory
app.mount("/static", StaticFiles(directory=dir_path), name="static")

@app.get("/files")
async def list_files():
    try:
        # Ensure the directory exists
        if not os.path.exists(dir_path):
            return JSONResponse(status_code=404, content={"error": "Directory not found"})

        # List all files in the directory
        files = os.listdir(dir_path)

        # Check if there are no files
        if not files:
            return JSONResponse(status_code=200, content={"message": "No files found in the directory"})

        # Generate file URLs
        file_urls = [{"file": file, "url": f"http://127.0.0.1:8000/static/{file}"} for file in files]

        return {"files": file_urls}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.delete("/files/{file_name}")
async def delete_file(file_name: str):
    try:
        # Construct the full path to the file
        file_path = os.path.join(dir_path, file_name)

        # Check if the file exists
        if not os.path.exists(file_path):
            return JSONResponse(status_code=404, content={"error": "File not found"})

        # Delete the file
        os.remove(file_path)

        return {"message": f"File '{file_name}' deleted successfully"}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    os.makedirs(dir_path, exist_ok=True)
    file_location = os.path.join(dir_path, file.filename)

    try:
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Ingest document after saving
        doc_model = DocModel(
            dir_path=dir_path,
            collection_name='LangChainCollection',
            embeddings_name='openai'
        )
        await add_documents(doc_model)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

    return {"info": f"File '{file.filename}' saved and ingested successfully"}

async def add_documents(doc: DocModel):
    docs = load_n_split(doc.dir_path)
    vector_database(
        doc_text=docs,
        collection_name=doc.collection_name,
        embeddings_name=doc.embeddings_name
    )
    return {"message": "Documents added successfully"}

@app.on_event("startup")
def on_startup():
    """
    Event handler called when the application starts up.
    """
    # Ensure the data directory exists when the app starts
    os.makedirs(dir_path, exist_ok=True)
    create_db_and_tables()


@app.post("/doc_ingestion")
async def doc_ingestion(doc: DocModel):
    return await add_documents(doc)


@app.post("/query")
def query_response(query: QueryModel):
    """
    Endpoint to process user queries.
    Automatically generates a session_id if not provided.
    """
    # Automatically generate a session ID if none is provided
    if not query.session_id:
        query.session_id = str(uuid.uuid4())

    # Check if there is a conversation history for the session
    stored_memory = chat_session.load_history(query.session_id)
    if len(stored_memory) == 0:
        stored_memory = None

    # Get conversation chain
    chain = db_conversation_chain(
        stored_memory=stored_memory,
        llm_name=query.llm_name,
        collection_name=query.collection_name
    )

    if query.llm_name == 'openai':
        result, cost = count_tokens(chain, query.text)
    else:
        result = chain(query.text)
        cost = None

    sources = list(set([doc.metadata['source'] for doc in result['source_documents']]))
    answer = result['answer']
    chat_session.save_sess_db(query.session_id, query.text, answer)

    return {
        'answer': answer,
        "cost": cost,
        'source': sources,
        'session_id': query.session_id  # Return the session ID in the response
    }


@app.post("/delete")
def delete_session(session: DeleteSession):
    """
    Endpoint to delete a session from the database.
    """
    response = chat_session.delete_sess_db(session.session_id)
    return response
