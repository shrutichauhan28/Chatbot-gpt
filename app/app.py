from fastapi import Body, FastAPI, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse, FileResponse
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
import mimetypes
from docx import Document
import csv
import pandas as pd
import ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup
from fastapi.responses import HTMLResponse

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
CONVERTED_FILES_DIR: str = "../converted_files"

# Serve static files from the directory
app.mount("/static", StaticFiles(directory=dir_path), name="static")

@app.get("/static/{folder}/{file_name}")
async def serve_file(folder: str, file_name: str):
    file_path = os.path.join(dir_path, folder, file_name)
    
    if not os.path.exists(file_path):
        return JSONResponse(status_code=404, content={"error": "File not found"})
    
    # Check and register .docx MIME type if necessary
    mimetypes.add_type('application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.docx')
    
    mime_type, _ = mimetypes.guess_type(file_path)
    
    # If MIME type is not found, default to application/octet-stream
    if mime_type is None:
        mime_type = "application/octet-stream"

    return FileResponse(file_path, media_type=mime_type)

@app.get("/files/{filename}")
async def get_file(filename: str):
    file_path = os.path.join(CONVERTED_FILES_DIR, filename)
    if os.path.isfile(file_path):
        return FileResponse(
            path=file_path,
            media_type='application/octet-stream',
            headers={"Content-Disposition": f'inline; filename="{filename}"'}
        )
    return JSONResponse(status_code=404)

@app.get("/files")
async def list_files():
    try:
        if not os.path.exists(dir_path):
            return JSONResponse(status_code=404, content={"error": "Directory not found"})

        files_by_folder = {}
        
        # Original files stored in dir_path
        for root, dirs, files in os.walk(dir_path):
            relative_folder = os.path.relpath(root, dir_path)
            if files:
                files_by_folder[relative_folder] = [
                    {
                        "file": file,
                        "url": f"http://127.0.0.1:8000/static/{relative_folder}/{file}",  # Original file URL
                        "converted_url": f"http://127.0.0.1:8000/static/converted_files/{file}.html"  # Converted file URL
                    }
                    for file in files
                ]
        
        if not files_by_folder:
            return JSONResponse(status_code=200, content={"message": "No files found"})

        return {"files": files_by_folder}

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

from fastapi import UploadFile, Form

# File upload endpoint with folder creation support
@app.post("/upload")
async def upload_file(file: UploadFile, folder: str = Form(...), create_new_folder: bool = Form(False)):
    try:
        folder_path = os.path.join(dir_path, folder)
        
        # Create a new folder if specified, otherwise ensure the selected folder exists
        if create_new_folder:
            os.makedirs(folder_path, exist_ok=True)
        else:
            if not os.path.exists(folder_path):
                return JSONResponse(status_code=404, content={"error": "Selected folder does not exist"})

        # Save the file to the specified folder
        file_location = os.path.join(folder_path, file.filename)
        with open(file_location, "wb") as f:
            f.write(await file.read())

        return {"message": f"File '{file.filename}' uploaded successfully to {folder}."}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

async def add_documents(doc: DocModel):
    # doc.dir_path should be a string path to the directory containing documents
    if isinstance(doc.dir_path, str):
        docs = load_n_split(doc.dir_path)  # Use the directory path directly
    else:
        return {"message": "Invalid directory path"}
    
    vector_database(
        doc_text=docs,  # This should be appropriate type for vector_database
        collection_name=doc.collection_name,
        embeddings_name=doc.embeddings_name
    )
    return {"message": "Documents added successfully"}



@app.post("/doc_ingestion")
async def doc_ingestion(doc: DocModel):
    return await add_documents(doc)



def convert_file(file_path: str, file_extension: str):
    """
    Converts various document types to text format.
    
    Args:
        file_path (str): The path of the file to be converted.
        file_extension (str): The file extension (type) of the document.
    """
    try:
        # Detect file type and handle accordingly
        if file_extension == ".docx":
            # Convert DOCX to TXT
            doc = Document(file_path)
            content = ''
            for para in doc.paragraphs:
                content += para.text + "\n"
            
            # Save the converted text to a .txt file
            txt_file_path = os.path.join(CONVERTED_FILES_DIR, os.path.basename(file_path).replace(".docx", ".txt"))
            with open(txt_file_path, "w", encoding="utf-8") as f:
                f.write(content)

        elif file_extension == ".csv":
            # Convert CSV to TXT
            with open(file_path, newline='', encoding="utf-8") as csvfile:
                reader = csv.reader(csvfile)
                content = ''
                for row in reader:
                    content += ','.join(row) + '\n'
            
            # Save the converted text to a .txt file
            txt_file_path = os.path.join(CONVERTED_FILES_DIR, os.path.basename(file_path).replace(".csv", ".txt"))
            with open(txt_file_path, "w", encoding="utf-8") as f:
                f.write(content)

        elif file_extension == ".xlsx":
            # Convert XLSX to TXT
            df = pd.read_excel(file_path)
            content = df.to_string(index=False)
            
            # Save the converted text to a .txt file
            txt_file_path = os.path.join(CONVERTED_FILES_DIR, os.path.basename(file_path).replace(".xlsx", ".txt"))
            with open(txt_file_path, "w", encoding="utf-8") as f:
                f.write(content)

        elif file_extension == ".epub":
            # Convert EPUB to TXT
            book = epub.read_epub(file_path)
            content = ''
            
            for item in book.get_items():
                if item.get_type() == ebooklib.ITEM_DOCUMENT:
                    soup = BeautifulSoup(item.get_content(), 'html.parser')
                    content += soup.get_text() + "\n"

            # Save the converted text to a .txt file
            txt_file_path = os.path.join(CONVERTED_FILES_DIR, os.path.basename(file_path).replace(".epub", ".txt"))
            with open(txt_file_path, "w", encoding="utf-8") as f:
                f.write(content)

    except Exception as e:
        print(f"Error converting file {file_path}: {str(e)}")

def convert_existing_files():
    """
    Convert all existing files in the data directory upon startup.
    """
    os.makedirs(CONVERTED_FILES_DIR, exist_ok=True)

    # Iterate through files in the original data directory
    for root, dirs, files in os.walk(dir_path):
        for file in files:
            file_path = os.path.join(root, file)
            file_extension = Path(file).suffix.lower()

            # Only convert files with supported extensions
            if file_extension in ['.docx', '.csv', '.xlsx', '.epub']:
                convert_file(file_path, file_extension)

@app.on_event("startup")
def on_startup():
    """
    Event handler called when the application starts up.
    """
    # Ensure the data directory exists when the app starts
    os.makedirs(dir_path, exist_ok=True)
    create_db_and_tables()

    # Convert existing files to the supported formats
    convert_existing_files()



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
    stored_memory = None
    # if len(stored_memory) == 0:
        # stored_memory = None

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

    # sources = list(set([doc.metadata['source'] for doc in result['source_documents']]))
    
    # # Generate final answer by appending sources to the AI response
    # answer = result['answer']
    # sources_str = "\nSources:\n" + "\n".join(sources)  # Format sources into a string
    # final_answer = f"{answer}\n\n{sources_str}"  # Append sources to the answer
    
    # # Save only the current interaction, if needed
    # chat_session.save_sess_db(query.session_id, query.text, final_answer)

    return {
        'answer': answer,
        "cost": cost,
        'source': sources,
        'session_id': query.session_id  # Return the session ID in the response
    }


@app.delete("/delete")
async def delete_file(folder: str = Body(...), fileName: str = Body(...)):
    try:
        file_path = os.path.join(dir_path, folder, fileName)

        if not os.path.exists(file_path):
            return JSONResponse(status_code=404, content={"error": "File not found"})

        os.remove(file_path)
        return {"message": f"File '{fileName}' deleted successfully from {folder}."}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# Endpoint to fetch existing folders
@app.get("/folders")
async def get_folders():
    try:
        # Check if the data directory exists
        if not os.path.exists(dir_path):
            os.makedirs(dir_path)
        
        # Get all folders in the directory
        folders = [f for f in os.listdir(dir_path) if os.path.isdir(os.path.join(dir_path, f))]
        return {"folders": folders}
    
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.delete("/files/{folder}/{file_name}")
async def delete_file(folder: str, file_name: str):
    try:
        # Construct the full path to the file
        file_path = os.path.join(dir_path, folder, file_name)

        if not os.path.exists(file_path):
            return JSONResponse(status_code=404, content={"error": "File not found"})

        os.remove(file_path)
        return {"message": f"File '{file_name}' deleted successfully from {folder}."}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})