from app.repositories.domain import (
    UserRepository,
    DeploymentRepository,
    MonitoringMetricRepository,
    NotificationRepository,
    SystemLogRepository,
    CloudResourceRepository,
    ContainerRepository,
    SettingRepository
)

user_repo = UserRepository()
deployment_repo = DeploymentRepository()
monitoring_repo = MonitoringMetricRepository()
notification_repo = NotificationRepository()
log_repo = SystemLogRepository()
resource_repo = CloudResourceRepository()
container_repo = ContainerRepository()
setting_repo = SettingRepository()
