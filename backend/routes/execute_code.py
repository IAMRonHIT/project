import ast
import sys
import io
import traceback
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from contextlib import redirect_stdout, redirect_stderr

router = APIRouter()

class CodeExecutionRequest(BaseModel):
    code: str

class CodeExecutionResponse(BaseModel):
    output: str
    error: str | None = None

class PythonExecutionResponse(BaseModel):
    stdout: str | None = None
    stderr: str | None = None
    error: str | None = None
    html_preview: str | None = None

@router.post("/api/execute-code")
async def execute_code(request: CodeExecutionRequest):
    """
    Execute code in a sandboxed environment and return the output.
    Uses restricted execution for safety.
    """
    code = request.code
    
    # Check if code contains dangerous operations
    if _contains_unsafe_operations(code):
        return CodeExecutionResponse(
            output="",
            error="Code contains potentially unsafe operations and was blocked for security reasons."
        )
    
    # Capture stdout and stderr
    stdout_capture = io.StringIO()
    stderr_capture = io.StringIO()
    
    try:
        # Execute with output capture
        with redirect_stdout(stdout_capture), redirect_stderr(stderr_capture):
            # First, compile to check for syntax errors
            compiled_code = compile(code, '<string>', 'exec')
            
            # Create a restricted global scope
            restricted_globals = {
                '__builtins__': {
                    name: getattr(__builtins__, name)
                    for name in ['abs', 'all', 'any', 'bool', 'chr', 'dict', 'dir', 'enumerate', 
                              'filter', 'float', 'format', 'frozenset', 'hash', 'hex', 'int', 
                              'isinstance', 'issubclass', 'len', 'list', 'map', 'max', 'min', 
                              'oct', 'ord', 'pow', 'print', 'range', 'repr', 'reversed', 
                              'round', 'set', 'slice', 'sorted', 'str', 'sum', 'tuple', 'type', 'zip']
                }
            }
            
            # Execute code in the restricted environment
            exec(compiled_code, restricted_globals, {})
        
        # Get output
        stdout_output = stdout_capture.getvalue()
        stderr_output = stderr_capture.getvalue()
        
        # Return combined output
        if stderr_output:
            return CodeExecutionResponse(
                output=stdout_output,
                error=stderr_output
            )
        else:
            return CodeExecutionResponse(output=stdout_output)
            
    except Exception as e:
        # Return error message
        return CodeExecutionResponse(
            output="",
            error=f"Error: {str(e)}"
        )

def _contains_unsafe_operations(code: str) -> bool:
    """
    Check if the code contains potentially unsafe operations.
    This is a basic implementation and should be enhanced in production.
    """
    try:
        parsed = ast.parse(code)
        
        # Check for import statements
        for node in ast.walk(parsed):
            if isinstance(node, ast.Import) or isinstance(node, ast.ImportFrom):
                return True
            
            # Check for potentially dangerous function calls
            if isinstance(node, ast.Call):
                func_name = ""
                if isinstance(node.func, ast.Name):
                    func_name = node.func.id
                elif isinstance(node.func, ast.Attribute) and isinstance(node.func.value, ast.Name):
                    func_name = f"{node.func.value.id}.{node.func.attr}"
                
                dangerous_funcs = [
                    'eval', 'exec', 'compile', 'open', 'file', 
                    '__import__', 'globals', 'locals', 'delattr',
                    'setattr', 'os.', 'sys.', 'subprocess.', 'shutil.'
                ]
                
                if any(df in func_name for df in dangerous_funcs):
                    return True
        
        return False
    except SyntaxError:
        # If we can't parse it, better to be safe
        return True


@router.post("/api/execute-python", response_model=PythonExecutionResponse)
async def execute_python_code(request: CodeExecutionRequest):
    code = request.code
    
    stdout_capture = io.StringIO()
    stderr_capture = io.StringIO()
    
    # Store the original stdout and stderr
    original_stdout = sys.stdout
    original_stderr = sys.stderr

    try:
        # Redirect stdout and stderr
        sys.stdout = stdout_capture
        sys.stderr = stderr_capture
        
        # Execute the code
        execution_globals = {}
        exec(code, execution_globals)
        
        stdout_val = stdout_capture.getvalue()
        stderr_val = stderr_capture.getvalue()
        html_preview_val = execution_globals.get("__html_output__")
        if not isinstance(html_preview_val, str):
            html_preview_val = None # Ensure it's a string or None
        
        return PythonExecutionResponse(stdout=stdout_val, stderr=stderr_val, html_preview=html_preview_val)
        
    except Exception as e:
        # Capture any exception during execution
        error_val = traceback.format_exc()
        stderr_val = stderr_capture.getvalue() # Get any stderr written before/during exception
        # It's possible the exception itself was written to stderr by Python
        # If error_val is already in stderr_val, we might not need to duplicate
        # but format_exc() is more comprehensive for the 'error' field.
        # Even if there's an error, check if html_output was set before the error
        html_preview_val = execution_globals.get("__html_output__")
        if not isinstance(html_preview_val, str):
            html_preview_val = None
            
        return PythonExecutionResponse(
            stdout=stdout_capture.getvalue(), 
            stderr=stderr_val, 
            error=error_val,
            html_preview=html_preview_val
        )
    finally:
        # Restore stdout and stderr
        sys.stdout = original_stdout
        sys.stderr = original_stderr
        
        stdout_capture.close()
        stderr_capture.close()
