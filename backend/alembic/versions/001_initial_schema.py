"""Initial schema migration

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-07-28 14:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('full_name', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('role', sa.Enum('ADMIN', 'DEVELOPER', 'USER', name='roleenum'), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True, default=True),
        sa.Column('is_verified', sa.Boolean(), nullable=True, default=False),
        sa.Column('profile_image', sa.String(length=255), nullable=True),
        sa.Column('last_login', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    # Deployments table
    op.create_table(
        'deployments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('project_name', sa.String(length=100), nullable=False),
        sa.Column('version', sa.String(length=50), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('environment', sa.String(length=50), nullable=False),
        sa.Column('server_name', sa.String(length=100), nullable=False),
        sa.Column('docker_image', sa.String(length=255), nullable=False),
        sa.Column('container_name', sa.String(length=100), nullable=False),
        sa.Column('created_by', sa.Integer(), nullable=True),
        sa.Column('deployment_time', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_deployments_id'), 'deployments', ['id'], unique=False)

    # Monitoring Metrics table
    op.create_table(
        'monitoring_metrics',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('cpu_usage', sa.Float(), nullable=False),
        sa.Column('memory_usage', sa.Float(), nullable=False),
        sa.Column('disk_usage', sa.Float(), nullable=False),
        sa.Column('network_usage', sa.Float(), nullable=False),
        sa.Column('requests', sa.Integer(), nullable=False),
        sa.Column('errors', sa.Integer(), nullable=False),
        sa.Column('latency', sa.Float(), nullable=False),
        sa.Column('uptime', sa.Float(), nullable=False),
        sa.Column('timestamp', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_monitoring_metrics_id'), 'monitoring_metrics', ['id'], unique=False)

    # Notifications table
    op.create_table(
        'notifications',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('type', sa.String(length=50), nullable=False),
        sa.Column('is_read', sa.Boolean(), nullable=True, default=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_notifications_id'), 'notifications', ['id'], unique=False)

    # System Logs table
    op.create_table(
        'system_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('level', sa.String(length=20), nullable=False),
        sa.Column('source', sa.String(length=100), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('timestamp', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_system_logs_id'), 'system_logs', ['id'], unique=False)

    # Cloud Resources table
    op.create_table(
        'cloud_resources',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('type', sa.String(length=50), nullable=False),
        sa.Column('region', sa.String(length=50), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('cost_per_month', sa.Float(), nullable=True, default=0.0),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_cloud_resources_id'), 'cloud_resources', ['id'], unique=False)

    # Containers table
    op.create_table(
        'containers',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('image', sa.String(length=255), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('ports', sa.String(length=100), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_containers_id'), 'containers', ['id'], unique=False)

    # Settings table
    op.create_table(
        'settings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('key', sa.String(length=100), nullable=False),
        sa.Column('value', sa.Text(), nullable=False),
        sa.Column('description', sa.String(length=255), nullable=True),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_settings_id'), 'settings', ['id'], unique=False)
    op.create_index(op.f('ix_settings_key'), 'settings', ['key'], unique=True)

    # Activity Logs table
    op.create_table(
        'activity_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('action', sa.String(length=100), nullable=False),
        sa.Column('details', sa.Text(), nullable=True),
        sa.Column('ip_address', sa.String(length=45), nullable=True),
        sa.Column('timestamp', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_activity_logs_id'), 'activity_logs', ['id'], unique=False)

    # API Keys table
    op.create_table(
        'api_keys',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('key', sa.String(length=255), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=True, default=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_api_keys_id'), 'api_keys', ['id'], unique=False)
    op.create_index(op.f('ix_api_keys_key'), 'api_keys', ['key'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_api_keys_key'), table_name='api_keys')
    op.drop_index(op.f('ix_api_keys_id'), table_name='api_keys')
    op.drop_table('api_keys')

    op.drop_index(op.f('ix_activity_logs_id'), table_name='activity_logs')
    op.drop_table('activity_logs')

    op.drop_index(op.f('ix_settings_key'), table_name='settings')
    op.drop_index(op.f('ix_settings_id'), table_name='settings')
    op.drop_table('settings')

    op.drop_index(op.f('ix_containers_id'), table_name='containers')
    op.drop_table('containers')

    op.drop_index(op.f('ix_cloud_resources_id'), table_name='cloud_resources')
    op.drop_table('cloud_resources')

    op.drop_index(op.f('ix_system_logs_id'), table_name='system_logs')
    op.drop_table('system_logs')

    op.drop_index(op.f('ix_notifications_id'), table_name='notifications')
    op.drop_table('notifications')

    op.drop_index(op.f('ix_monitoring_metrics_id'), table_name='monitoring_metrics')
    op.drop_table('monitoring_metrics')

    op.drop_index(op.f('ix_deployments_id'), table_name='deployments')
    op.drop_table('deployments')

    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
