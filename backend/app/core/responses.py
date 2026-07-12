from typing import Any, Dict, List, Optional

def success_response(data: Any = None, message: str = "Request successful") -> Dict[str, Any]:
    return {
        "success": True,
        "message": message,
        "data": data if data is not None else {}
    }

def error_response(message: str, errors: Optional[List[Any]] = None, status: int = 400) -> Dict[str, Any]:
    return {
        "success": False,
        "message": message,
        "errors": errors if errors is not None else [],
        "status": status
    }
