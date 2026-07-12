from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user_id
from app.services import deployment_service, resource_service, container_service, DashboardService
from app.repositories import user_repo
from app.schemas.domain import DeploymentCreate, DeploymentOut, CloudResourceCreate, CloudResourceOut, ContainerCreate, ContainerOut
from app.core.responses import success_response

api_router = APIRouter()

# --- Dashboard ---
@api_router.get("/dashboard/summary", tags=["Dashboard"])
def get_dashboard_summary(current_user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    user = user_repo.get(db, current_user_id)
    data = DashboardService.get_summary(db, user)
    return success_response(data=data)

@api_router.get("/dashboard/statistics", tags=["Dashboard"])
def get_dashboard_statistics(current_user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    data = DashboardService.get_statistics(db)
    return success_response(data=data)

# --- Deployments ---
@api_router.get("/deployments", tags=["Deployments"])
def get_deployments(current_user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    items = deployment_service.get_all(db)
    return success_response(data=[DeploymentOut.model_validate(i).model_dump() for i in items])

@api_router.post("/deployments", tags=["Deployments"])
def create_deployment(obj_in: DeploymentCreate, current_user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    # Inject created_by
    class _ObjIn:
        def model_dump(self, **kwargs):
            d = obj_in.model_dump()
            d["created_by"] = current_user_id
            return d
    item = deployment_service.create(db, _ObjIn())
    return success_response(data=DeploymentOut.model_validate(item).model_dump(), message="Deployment created")

@api_router.delete("/deployments/{id}", tags=["Deployments"])
def delete_deployment(id: int, current_user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    deployment_service.delete(db, id)
    return success_response(message="Deployment deleted")

# --- Cloud Resources ---
@api_router.get("/resources", tags=["Resources"])
def get_resources(current_user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    items = resource_service.get_all(db)
    return success_response(data=[CloudResourceOut.model_validate(i).model_dump() for i in items])

@api_router.post("/resources", tags=["Resources"])
def create_resource(obj_in: CloudResourceCreate, current_user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    class _ObjIn:
        def model_dump(self, **kwargs):
            d = obj_in.model_dump()
            d["status"] = "running"
            return d
    item = resource_service.create(db, _ObjIn())
    return success_response(data=CloudResourceOut.model_validate(item).model_dump())

@api_router.delete("/resources/{id}", tags=["Resources"])
def delete_resource(id: int, current_user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    resource_service.delete(db, id)
    return success_response(message="Resource deleted")

# --- Containers ---
@api_router.get("/containers", tags=["Containers"])
def get_containers(current_user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    items = container_service.get_all(db)
    return success_response(data=[ContainerOut.model_validate(i).model_dump() for i in items])

@api_router.post("/containers", tags=["Containers"])
def create_container(obj_in: ContainerCreate, current_user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    class _ObjIn:
        def model_dump(self, **kwargs):
            d = obj_in.model_dump()
            d["status"] = "running"
            return d
    item = container_service.create(db, _ObjIn())
    return success_response(data=ContainerOut.model_validate(item).model_dump())

@api_router.delete("/containers/{id}", tags=["Containers"])
def delete_container(id: int, current_user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    container_service.delete(db, id)
    return success_response(message="Container deleted")
