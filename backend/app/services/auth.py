from sqlalchemy.orm import Session
from app.repositories import user_repo
from app.schemas.domain import UserCreate, LoginRequest, UserOut
from app.security import get_password_hash, verify_password, create_access_token
from app.core.exceptions import AppException

class AuthService:
    @staticmethod
    def register_user(db: Session, user_in: UserCreate):
        user = user_repo.get_by_email(db, user_in.email)
        if user:
            raise AppException(message="Email already registered", status_code=400)

        # Dump to dict, exclude raw password, use python mode for enum serialization
        user_data = user_in.model_dump(exclude={"password"}, mode="python")
        # Convert RoleEnum to its string value for SQLAlchemy compatibility
        if hasattr(user_data.get("role"), "value"):
            user_data["role"] = user_data["role"].value
        user_data["password_hash"] = get_password_hash(user_in.password)

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
        # Serialize user via Pydantic schema to avoid exposing sensitive fields
        user_out = UserOut.model_validate(user).model_dump(mode="json")
        return {"access_token": access_token, "token_type": "bearer", "user": user_out}
