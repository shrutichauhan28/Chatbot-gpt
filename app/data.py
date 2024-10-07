from typing import List, Optional
from langchain.docstore.document import Document
from langchain.document_loaders import DirectoryLoader, TextLoader
from pdfplumber import open as pdf_open
from docx import Document as DocxDocument
import pandas as pd
import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from rerank import rank_chunks_with_bm25

class CleanTextLoader(TextLoader):
    """Load text files."""

    def __init__(self, file_path: str, encoding='utf-8', errors='ignore'):
        """Initialize with file path."""
        self.file_path = file_path
        self.encoding = encoding

    def load(self) -> List[Document]:
        """Load from file path."""
        with open(self.file_path, encoding=self.encoding) as f:
            text = f.read()
        text = self.clean_text(text)
        metadata = {"source": self.file_path}
        return [Document(page_content=text, metadata=metadata)]

    def clean_text(self, text):
        # Clean up the text as needed
        lines = (line.strip() for line in text.splitlines())
        text = ' '.join(line for line in lines)
        text = ' '.join(text.split())
        text = '\n'.join(line for line in text.splitlines() if line.strip())
        return text

class PDFLoader:
    """Load PDF files."""

    def __init__(self, file_path: str):
        self.file_path = file_path

    def load(self) -> List[Document]:
        with pdf_open(self.file_path) as pdf:
            text = ''
            for page in pdf.pages:
                text += page.extract_text()
        text = CleanTextLoader.clean_text(self, text)
        metadata = {"source": self.file_path}
        return [Document(page_content=text, metadata=metadata)]

class DocxLoader:
    """Load DOCX files."""

    def __init__(self, file_path: str):
        self.file_path = file_path

    def load(self) -> List[Document]:
        doc = DocxDocument(self.file_path)
        text = '\n'.join([para.text for para in doc.paragraphs])
        text = CleanTextLoader.clean_text(self, text)
        metadata = {"source": self.file_path}
        return [Document(page_content=text, metadata=metadata)]

class CSVLoader:
    """Load CSV files."""

    def __init__(self, file_path: str):
        self.file_path = file_path

    def load(self) -> List[Document]:
        df = pd.read_csv(self.file_path)
        text = df.to_string(index=False)
        text = CleanTextLoader.clean_text(self, text)
        metadata = {"source": self.file_path}
        return [Document(page_content=text, metadata=metadata)]

class ExcelLoader:
    """Load Excel files."""

    def __init__(self, file_path: str):
        self.file_path = file_path

    def load(self) -> List[Document]:
        df = pd.read_excel(self.file_path)
        text = df.to_string(index=False)
        text = CleanTextLoader.clean_text(self, text)
        metadata = {"source": self.file_path}
        return [Document(page_content=text, metadata=metadata)]

# Updated function to load different file types
def load_n_split(path: str) -> List[Document]:
    """
    path: directory path having files (text, pdf, csv, docx, xlsx).
    This function reads files, cleans them, and splits them into chunks.
    """
    documents = []
    for root, dirs, files in os.walk(path):
        for file in files:
            file_path = os.path.join(root, file)
            try:
                if file.endswith('.txt'):
                    loader = CleanTextLoader(file_path)
                elif file.endswith('.pdf'):
                    loader = PDFLoader(file_path)
                elif file.endswith('.docx'):
                    loader = DocxLoader(file_path)
                elif file.endswith('.csv'):
                    loader = CSVLoader(file_path)
                elif file.endswith('.xlsx'):
                    loader = ExcelLoader(file_path)
                else:
                    print(f"Unsupported file type: {file}")
                    continue

                # Load the document
                docs = loader.load()
                documents.extend(docs)
            except Exception as e:
                print(f"Error loading file {file_path}: {e}")

    # Use RecursiveCharacterTextSplitter to split the documents
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=80)

    split_docs = []
    for doc in documents:
        split_docs.extend(splitter.split_documents([doc]))

    return split_docs

# Example of updated load_n_split function using BM25 reranking
def load_n_split_and_rerank(path: str, query: str) -> List[Document]:
    """
    Load files from the directory, split them into chunks, and rerank them based on the BM25 algorithm.

    Args:
        path (str): The path to the directory containing the files.
        query (str): The query to use for ranking the chunks.

    Returns:
        List[Document]: The reranked chunks based on relevance to the query.
    """
    # Load and split the documents as usual
    documents = load_n_split(path)
    
    # Rerank the chunks using BM25
    reranked_chunks = rank_chunks_with_bm25(documents, query)
    
    # Optionally return only the reranked chunks (without the BM25 score)
    return [chunk for chunk, score in reranked_chunks]
