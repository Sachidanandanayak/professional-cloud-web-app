import sys
import os

# Add parent directory to path so we can import app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.database import SessionLocal
from app.schemas.domain import UserCreate, DeploymentCreate
from app.services.auth import AuthService
from app.services import deployment_service
import time

def init_mock_data():
    db = SessionLocal()
    try:
        print("Creating mock user...")
        user_in = UserCreate(
            full_name="Admin User",
            email="admin@nexuscloud.com",
            password="password123",
            role="admin"
        )
        try:
            user = AuthService.register_user(db, user_in)
            user.is_verified = True
            db.commit()
            print(f"User created: {user.email}")
        except Exception as e:
            print("User might already exist.")
            user = db.query(AuthService).first() # just fallback
            pass

        print("Creating mock deployment...")
        if user:
            dep_in = DeploymentCreate(
                project_name="frontend-web",
                version="v1.0.4",
                environment="production",
                server_name="us-east-1a",
                docker_image="nexus/frontend:latest",
                container_name="web-01"
            )
            # manually add created_by
            class _DepIn:
                def model_dump(self, **kwargs):
                    d = dep_in.model_dump()
                    d["created_by"] = user.id
                    d["status"] = "success"
                    return d
            deployment_service.create(db, _DepIn())
            print("Mock deployment created.")
            
        print("Mock data generation complete!")
    finally:
        db.close()

if __name__ == "__main__":
    # Wait a bit for db to be fully ready if running via some script
    time.sleep(2)
    init_mock_data()
