from typing import List, Optional
from langchain.docstore.document import Document
from langchain.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import TokenTextSplitter
from pdfplumber import open as pdf_open
from docx import Document as DocxDocument
import pandas as pd
import os

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
def load_n_split(path, splitter="token"):
    """
    path: directory path having files (text, pdf, csv, docx, xlsx).
    This function reads files, cleans them, and splits them into chunks.
    """
    documents = []
    for root, dirs, files in os.walk(path):
        for file in files:
            file_path = os.path.join(root, file)
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
                print(f"Unsupported file format: {file}")
                continue
            documents.extend(loader.load())

    if splitter == "token":
        text_splitter = TokenTextSplitter(chunk_size=80, chunk_overlap=20)
    else:
        raise ValueError('Invalid splitter')

    doct_text = text_splitter.split_documents(documents)
    return doct_text
