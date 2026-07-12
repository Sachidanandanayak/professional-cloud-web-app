from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.core.exceptions import AppException
from app.logger import logger

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def get_current_user_id(token: str = Depends(oauth2_scheme)) -> int:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise AppException(message="Invalid authentication credentials", status_code=401)
        return int(user_id)
    except JWTError as e:
        logger.error(f"JWT decode error: {str(e)}")
        raise AppException(message="Invalid or expired token", status_code=401)
