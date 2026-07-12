from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models.domain import RoleEnum

# --- Auth & Users ---
class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    role: RoleEnum = RoleEnum.USER

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    profile_image: Optional[str] = None

class UserOut(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    profile_image: Optional[str]
    last_login: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# --- Deployments ---
class DeploymentBase(BaseModel):
    project_name: str
    version: str
    environment: str
    server_name: str
    docker_image: str
    container_name: str

class DeploymentCreate(DeploymentBase):
    pass

class DeploymentOut(DeploymentBase):
    id: int
    status: str
    created_by: int
    deployment_time: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Monitoring ---
class MonitoringMetricOut(BaseModel):
    id: int
    cpu_usage: float
    memory_usage: float
    disk_usage: float
    network_usage: float
    requests: int
    errors: int
    latency: float
    uptime: float
    timestamp: datetime
    
    class Config:
        from_attributes = True

# --- Notifications ---
class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Cloud Resources ---
class CloudResourceBase(BaseModel):
    name: str
    type: str
    region: str

class CloudResourceCreate(CloudResourceBase):
    pass

class CloudResourceOut(CloudResourceBase):
    id: int
    status: str
    cost_per_month: float
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Containers ---
class ContainerBase(BaseModel):
    name: str
    image: str
    ports: Optional[str] = None

class ContainerCreate(ContainerBase):
    pass

class ContainerOut(ContainerBase):
    id: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- System Logs ---
class SystemLogOut(BaseModel):
    id: int
    level: str
    source: str
    message: str
    timestamp: datetime
    
    class Config:
        from_attributes = True

# --- Settings ---
class SettingUpdate(BaseModel):
    value: str

class SettingOut(BaseModel):
    id: int
    key: str
    value: str
    description: Optional[str]
    updated_at: datetime
    
    class Config:
        from_attributes = True
