from typing import List, Optional, Tuple, Dict, Any
from extensions import db
from models.ActivityLogModel import ActivityLog


def create_activity_log(
    user_id: Optional[int],
    user_name: str,
    user_role: str,
    action: str,
    module: str,
    summary: str,
    target_id: Optional[int] = None,
    changes: Optional[Dict[str, Any]] = None
) -> ActivityLog:
    """Lưu một bản ghi nhật ký hoạt động mới"""
    log = ActivityLog(
        user_id=user_id,
        user_name=user_name,
        user_role=user_role,
        action=action,
        module=module,
        summary=summary,
        target_id=target_id,
        changes=changes
    )
    try:
        db.session.add(log)
        db.session.commit()
        return log
    except Exception:
        db.session.rollback()
        raise


def get_activity_logs(
    limit: int = 50,
    offset: int = 0,
    module: Optional[str] = None,
    action: Optional[str] = None,
    user_id: Optional[int] = None
) -> Tuple[List[ActivityLog], int]:
    """Lấy danh sách nhật ký kèm theo tổng số bản ghi"""
    query = ActivityLog.query

    if module:
        query = query.filter(ActivityLog.module == module)
    if action:
        query = query.filter(ActivityLog.action == action)
    if user_id:
        query = query.filter(ActivityLog.user_id == user_id)

    total = query.count()
    logs = query.order_by(ActivityLog.created_at.desc(), ActivityLog.id.desc())\
        .offset(offset)\
        .limit(limit)\
        .all()

    return logs, total

