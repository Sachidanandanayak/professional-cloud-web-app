from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.domain import UserCreate, UserOut, LoginRequest, Token
from app.services.auth import AuthService
from app.core.responses import success_response
from app.dependencies import get_current_user_id
from app.repositories import user_repo

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    user = AuthService.register_user(db, user_in)
    return success_response(data={"id": user.id}, message="User registered successfully")

@router.post("/login")
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    result = AuthService.authenticate_user(db, login_data)
    return success_response(data=result, message="Logged in successfully")

@router.post("/logout")
def logout():
    return success_response(message="Logged out successfully")

@router.post("/refresh")
def refresh():
    return success_response(message="Token refreshed")

@router.get("/profile", response_model=dict)
def get_profile(current_user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    user = user_repo.get(db, current_user_id)
    return success_response(data=UserOut.model_validate(user).model_dump())
