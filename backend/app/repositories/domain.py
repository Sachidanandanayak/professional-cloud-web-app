from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.domain import User, Deployment, MonitoringMetric, Notification, SystemLog, CloudResource, Container, Setting
from app.repositories.base import BaseRepository
from datetime import datetime

class UserRepository(BaseRepository[User]):
    def __init__(self):
        super().__init__(User)
        
    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

class DeploymentRepository(BaseRepository[Deployment]):
    def __init__(self):
        super().__init__(Deployment)
        
    def get_by_user(self, db: Session, user_id: int) -> List[Deployment]:
        return db.query(Deployment).filter(Deployment.created_by == user_id).all()

class MonitoringMetricRepository(BaseRepository[MonitoringMetric]):
    def __init__(self):
        super().__init__(MonitoringMetric)
        
    def get_latest(self, db: Session) -> Optional[MonitoringMetric]:
        return db.query(MonitoringMetric).order_by(MonitoringMetric.timestamp.desc()).first()
        
    def get_history(self, db: Session, limit: int = 100) -> List[MonitoringMetric]:
        return db.query(MonitoringMetric).order_by(MonitoringMetric.timestamp.desc()).limit(limit).all()

class NotificationRepository(BaseRepository[Notification]):
    def __init__(self):
        super().__init__(Notification)
        
    def get_by_user(self, db: Session, user_id: int) -> List[Notification]:
        return db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc()).all()
        
    def mark_as_read(self, db: Session, notification_id: int) -> Optional[Notification]:
        notif = self.get(db, notification_id)
        if notif:
            notif.is_read = True
            db.commit()
            db.refresh(notif)
        return notif

class SystemLogRepository(BaseRepository[SystemLog]):
    def __init__(self):
        super().__init__(SystemLog)

class CloudResourceRepository(BaseRepository[CloudResource]):
    def __init__(self):
        super().__init__(CloudResource)

class ContainerRepository(BaseRepository[Container]):
    def __init__(self):
        super().__init__(Container)

class SettingRepository(BaseRepository[Setting]):
    def __init__(self):
        super().__init__(Setting)
        
    def get_by_key(self, db: Session, key: str) -> Optional[Setting]:
        return db.query(Setting).filter(Setting.key == key).first()
