from sqlalchemy.orm import Session
from typing import List, Any
from app.repositories import (
    user_repo, deployment_repo, monitoring_repo, 
    notification_repo, log_repo, resource_repo, container_repo, setting_repo
)
from app.core.exceptions import AppException
from datetime import datetime, timedelta
from app.models.domain import User

class GenericService:
    def __init__(self, repo: Any):
        self.repo = repo
        
    def get_all(self, db: Session, skip: int = 0, limit: int = 100):
        return self.repo.get_all(db, skip=skip, limit=limit)
        
    def get(self, db: Session, id: Any):
        obj = self.repo.get(db, id)
        if not obj:
            raise AppException(message="Resource not found", status_code=404)
        return obj
        
    def create(self, db: Session, obj_in: Any):
        return self.repo.create(db, obj_in)
        
    def update(self, db: Session, id: Any, obj_in: Any):
        db_obj = self.get(db, id)
        return self.repo.update(db, db_obj, obj_in)
        
    def delete(self, db: Session, id: Any):
        if not self.repo.delete(db, id):
            raise AppException(message="Resource not found", status_code=404)
        return True

class DashboardService:
    @staticmethod
    def get_summary(db: Session, current_user: User):
        # In a real scenario, this would aggregate data based on user id and roles
        deps = deployment_repo.get_all(db)
        resources = resource_repo.get_all(db)
        
        return {
            "total_deployments": len(deps),
            "active_resources": len(resources),
            "healthy_services": sum(1 for d in deps if d.status == "success"),
            "monthly_cost": sum(r.cost_per_month for r in resources)
        }

    @staticmethod
    def get_statistics(db: Session):
        metrics = monitoring_repo.get_history(db, limit=24) # Last 24 points
        return [
            {
                "time": m.timestamp.strftime("%H:%M"),
                "cpu": m.cpu_usage,
                "memory": m.memory_usage
            }
            for m in reversed(metrics)
        ]

user_service = GenericService(user_repo)
deployment_service = GenericService(deployment_repo)
resource_service = GenericService(resource_repo)
container_service = GenericService(container_repo)
setting_service = GenericService(setting_repo)
