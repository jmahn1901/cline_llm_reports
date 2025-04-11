"""
This module implements a FastAPI server for processing uploaded .txt files
and generating a concatenated batch report.
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware # Import CORS middleware
from typing import List
import logging

# Setup basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# --- CORS Configuration ---
# Allow requests from the frontend (typically served via file:// or localhost)
# Adjust origins if your frontend is served differently
origins = [
    "http://localhost",
    "http://localhost:8080", # Common port for live servers
    "http://127.0.0.1",
    "http://127.0.0.1:8080",
    "null", # Important for requests from file:// protocol
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods (GET, POST, etc.)
    allow_headers=["*"], # Allow all headers
)
# --- End CORS Configuration ---


@app.post("/upload/")
async def upload_files_and_generate_report(files: List[UploadFile] = File(...)):
    """
    Handles upload of multiple .txt files, concatenates their content,
    and returns the combined text as a batch report.

    Args:
        files (List[UploadFile]): List of uploaded files. Expects .txt files.

    Returns:
        dict: A dictionary containing the generated batch report under the "report" key.

    Raises:
        HTTPException: 400 if non-txt files are detected or decoding fails.
    """
    logger.info(f"Received {len(files)} file(s) for processing.")
    combined_content = []
    
    for file in files:
        if not file.filename.lower().endswith('.txt'):
            logger.warning(f"Skipping non-txt file: {file.filename}")
            # Optionally raise an error if strict .txt enforcement is needed
            # raise HTTPException(status_code=400, detail=f"Only .txt files are allowed. Found: {file.filename}")
            continue # Skip non-txt files silently for now

        logger.info(f"Processing file: {file.filename}")
        try:
            # Read file content asynchronously
            contents = await file.read()
            # Decode assuming UTF-8, handle potential errors
            text = contents.decode('utf-8')
            
            # Add a header for each file in the report for clarity
            combined_content.append(f"--- START OF FILE: {file.filename} ---")
            combined_content.append(text)
            combined_content.append(f"--- END OF FILE: {file.filename} ---\n") # Add extra newline for separation

        except UnicodeDecodeError:
            logger.error(f"Could not decode file {file.filename} as UTF-8.")
            raise HTTPException(status_code=400, detail=f"Could not decode file {file.filename}. Ensure it is UTF-8 encoded text.")
        except Exception as e:
            logger.error(f"Error processing file {file.filename}: {e}")
            raise HTTPException(status_code=500, detail=f"An error occurred processing file {file.filename}.")
        finally:
            # Ensure file resources are closed
             await file.close()


    if not combined_content:
         logger.warning("No valid .txt files found or processed.")
         raise HTTPException(status_code=400, detail="No valid .txt files were provided or processed.")

    # Join all parts with double newlines for separation between files
    final_report = "\n".join(combined_content)
    logger.info("Successfully generated combined report.")
    
    return {"report": final_report}

# Add a root endpoint for basic testing
@app.get("/")
async def read_root():
    return {"message": "Batch Report Generator API is running."}

# To run this app:
# 1. Install dependencies: pip install fastapi uvicorn python-multipart
# 2. Run the server: uvicorn app:app --reload --port 8000