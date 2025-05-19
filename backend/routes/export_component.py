from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
import os
import pathlib

router = APIRouter()

class ExportComponentRequest(BaseModel):
    componentName: str
    code: str
    targetPages: list[str]

@router.post("/api/export-component")
async def export_component(request: ExportComponentRequest):
    try:
        # Create components/Generated directory if it doesn't exist
        project_root = pathlib.Path(__file__).parent.parent.parent
        generated_dir = project_root / "src" / "components" / "Generated"
        generated_dir.mkdir(parents=True, exist_ok=True)
        
        # Write component file
        component_path = generated_dir / f"{request.componentName}.tsx"
        with open(component_path, 'w') as f:
            f.write(request.code)
            
        # Return success
        return {"success": True, "path": str(component_path)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
