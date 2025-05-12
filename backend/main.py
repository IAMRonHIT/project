import sys
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Add the parent directory of 'backend' to sys.path to allow root .env loading
# and to find the venv.gemini module
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, project_root)
sys.path.insert(0, os.path.join(project_root, 'backend'))


# Load environment variables from .env in the project root
dotenv_path = os.path.join(project_root, '.env')
load_dotenv(dotenv_path=dotenv_path)

# Now import the gemini module
# Ensure that venv is a package by having an __init__.py file if it's not already
# For simplicity here, assuming direct import works if PYTHONPATH is set up or venv is in sys.path
try:
    from venv import gemini as gemini_service
except ImportError as e:
    print(f"Error importing gemini_service: {e}")
    print(f"sys.path: {sys.path}")
    # As a fallback, try to adjust path assuming backend/venv/gemini.py
    # This might be needed if 'venv' itself is not treated as a package directly
    # For robust solution, backend/venv should be a package (contain __init__.py)
    # or the script needs to be runnable in a way that Python can find it.
    # For now, the sys.path modification above should help.
    # If issues persist, an __init__.py in backend/venv might be required.
    gemini_service = None


app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods
    allow_headers=["*"], # Allows all headers
)

from fastapi import Query
import importlib

@app.get("/api/test-gemini")
async def test_gemini_endpoint(mode: str = Query(default=None)):
    try:
        if mode == "realtime-audio":
            try:
                gemini_live = importlib.import_module("venv.gemini-live")
            except ImportError as e:
                print(f"Error importing gemini-live: {e}")
                raise HTTPException(status_code=500, detail="Could not import gemini-live module.")
            response_text = gemini_live.generate()
            return {"response": response_text}
        else:
            if not gemini_service:
                raise HTTPException(status_code=500, detail="Gemini service module not loaded.")
            response_text = gemini_service.generate()
            return {"response": response_text}
    except Exception as e:
        print(f"Error in test_gemini_endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Run from the 'backend' directory: uvicorn main:app --reload --port 3001
    # The frontend expects the backend on port 3001 based on VITE_BACKEND_URL
    uvicorn.run(app, host="0.0.0.0", port=3001)
