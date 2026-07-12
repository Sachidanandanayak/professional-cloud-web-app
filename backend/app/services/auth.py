from sqlalchemy.orm import Session
from app.repositories import user_repo
from app.schemas.domain import UserCreate, LoginRequest
from app.security import get_password_hash, verify_password, create_access_token
from app.core.exceptions import AppException

class AuthService:
    @staticmethod
    def register_user(db: Session, user_in: UserCreate):
        user = user_repo.get_by_email(db, user_in.email)
        if user:
            raise AppException(message="Email already registered", status_code=400)
            
        user_data = user_in.model_dump(exclude={"password"})
        user_data["password_hash"] = get_password_hash(user_in.password)
        
        # We need to create a slightly modified input for the generic repository create
        class _DbUserIn:
            def model_dump(self):
                return user_data
                
        return user_repo.create(db, _DbUserIn())

    @staticmethod
    def authenticate_user(db: Session, login_data: LoginRequest):
        user = user_repo.get_by_email(db, login_data.email)
        if not user or not verify_password(login_data.password, user.password_hash):
            raise AppException(message="Incorrect email or password", status_code=401)
        if not user.is_active:
            raise AppException(message="Inactive user", status_code=400)
            
        access_token = create_access_token(subject=user.id)
        return {"access_token": access_token, "token_type": "bearer", "user": user}
