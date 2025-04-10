"""
This module implements a FastAPI server for processing uploaded files
and generating a batch report using mock LLM processing.
"""

from fastapi import FastAPI, File, UploadFile
from typing import List
import PyPDF2
import docx

app = FastAPI()

def categorize_document(file_content: str) -> str:
    """
    Categorize the document based on its content.

    Args:
        file_content (str): The content of the file.

    Returns:
        str: The category of the document (e.g., SOP, BOM).
    """
    # Mock categorization logic
    if "SOP" in file_content:
        return "SOP"
    elif "BOM" in file_content:
        return "BOM"
    else:
        return "Unknown"

def extract_text_from_pdf(file: UploadFile) -> str:
    """
    Extract text from a PDF file.

    Args:
        file (UploadFile): The uploaded PDF file.

    Returns:
        str: The extracted text from the PDF.
    """
    reader = PyPDF2.PdfReader(file.file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

def extract_text_from_docx(file: UploadFile) -> str:
    """
    Extract text from a DOCX file.

    Args:
        file (UploadFile): The uploaded DOCX file.

    Returns:
        str: The extracted text from the DOCX.
    """
    doc = docx.Document(file.file)
    return "\n".join([para.text for para in doc.paragraphs])

def process_with_llm(document_type: str, text: str) -> str:
    """
    Process the text using a mock LLM based on the document type.

    Args:
        document_type (str): The type of the document (e.g., SOP, BOM).
        text (str): The text to be processed.

    Returns:
        str: The processed output from the LLM.
    """
    # Mock LLM processing
    return f"Processed {document_type}: {text[:100]}..."

@app.post("/upload/")
async def upload_files(files: List[UploadFile] = File(...)):
    """
    Handle file uploads and generate a batch report.

    Args:
        files (List[UploadFile]): List of uploaded files.

    Returns:
        dict: A dictionary containing the generated batch report.
    """
    batch_report = []
    for file in files:
        if file.filename.endswith('.pdf'):
            text = extract_text_from_pdf(file)
        elif file.filename.endswith('.docx'):
            text = extract_text_from_docx(file)
        else:
            text = (await file.read()).decode('utf-8')

        document_type = categorize_document(text)
        partial_output = process_with_llm(document_type, text)
        batch_report.append(partial_output)

    final_report = "\n\n".join(batch_report)
    return {"report": final_report}
