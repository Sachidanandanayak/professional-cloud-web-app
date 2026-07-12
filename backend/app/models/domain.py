from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class RoleEnum(str, enum.Enum):
    ADMIN = "admin"
    DEVELOPER = "developer"
    USER = "user"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.USER)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    profile_image = Column(String(255), nullable=True)
    
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    deployments = relationship("Deployment", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    api_keys = relationship("APIKey", back_populates="user")

class Deployment(Base):
    __tablename__ = "deployments"
    
    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String(100), nullable=False)
    version = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False) # e.g. success, failed, pending
    environment = Column(String(50), nullable=False) # e.g. production, staging
    server_name = Column(String(100), nullable=False)
    docker_image = Column(String(255), nullable=False)
    container_name = Column(String(100), nullable=False)
    
    created_by = Column(Integer, ForeignKey("users.id"))
    deployment_time = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    
    user = relationship("User", back_populates="deployments")

class MonitoringMetric(Base):
    __tablename__ = "monitoring_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    cpu_usage = Column(Float, nullable=False)
    memory_usage = Column(Float, nullable=False)
    disk_usage = Column(Float, nullable=False)
    network_usage = Column(Float, nullable=False)
    requests = Column(Integer, nullable=False)
    errors = Column(Integer, nullable=False)
    latency = Column(Float, nullable=False)
    uptime = Column(Float, nullable=False)
    
    timestamp = Column(DateTime, server_default=func.now())

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), nullable=False) # e.g. alert, info, success
    is_read = Column(Boolean, default=False)
    
    created_at = Column(DateTime, server_default=func.now())
    
    user = relationship("User", back_populates="notifications")

class SystemLog(Base):
    __tablename__ = "system_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    level = Column(String(20), nullable=False) # e.g. INFO, WARN, ERROR
    source = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    
    timestamp = Column(DateTime, server_default=func.now())

class CloudResource(Base):
    __tablename__ = "cloud_resources"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False) # e.g. EC2, S3, RDS
    region = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False)
    cost_per_month = Column(Float, default=0.0)
    
    created_at = Column(DateTime, server_default=func.now())

class Container(Base):
    __tablename__ = "containers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    image = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False)
    ports = Column(String(100), nullable=True)
    
    created_at = Column(DateTime, server_default=func.now())

class Setting(Base):
    __tablename__ = "settings"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, index=True, nullable=False)
    value = Column(Text, nullable=False)
    description = Column(String(255), nullable=True)
    
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
    ip_address = Column(String(45), nullable=True)
    
    timestamp = Column(DateTime, server_default=func.now())

class APIKey(Base):
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    key = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime, server_default=func.now())
    
    user = relationship("User", back_populates="api_keys")
