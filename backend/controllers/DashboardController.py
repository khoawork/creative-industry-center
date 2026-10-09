from flask import Blueprint, jsonify
from models.EventModel import Event
from models.ProjectModel import Project
from models.RecordModel import Record
from models.AwardModel import Award
from models.TrainingModel import Training
from models.FormSubmissionModel import FormSubmission
from models.ActivityLogModel import ActivityLog
from models.UserModel import User
from controllers.FormController import load_backend_form_configs

dashboard_api = Blueprint("dashboard_api", __name__, url_prefix="/dashboard")


@dashboard_api.route("/stats", methods=["GET"])
def get_dashboard_stats():
    """
    Thống kê tổng hợp số liệu thời gian thực cho Bảng điều khiển (Admin Dashboard)
    """
    try:
        events_count = Event.query.count()
        projects_count = Project.query.count()
        records_count = Record.query.count()
        awards_count = Award.query.count()
        trainings_count = Training.query.count()
        users_count = User.query.count()

        form_configs = load_backend_form_configs()
        forms_count = len(form_configs) if form_configs else 4

        total_submissions = FormSubmission.query.count()
        unread_submissions = FormSubmission.query.filter_by(is_read=False).count()

        # Thống kê trực quan theo modules trên Dashboard
        stats = [
            {
                "moduleId": "events",
                "label": "Sự kiện",
                "value": str(events_count).padStart(2, "0") if hasattr(str, "padStart") else f"{events_count:02d}",
                "detail": "đang quản lý",
                "count": events_count,
            },
            {
                "moduleId": "projects",
                "label": "Dự án",
                "value": f"{projects_count:02d}",
                "detail": "đang triển khai",
                "count": projects_count,
            },
            {
                "moduleId": "records",
                "label": "Đề cử kỷ lục",
                "value": f"{records_count:02d}",
                "detail": "hồ sơ đề cử",
                "count": records_count,
            },
            {
                "moduleId": "awards",
                "label": "Giải thưởng",
                "value": f"{awards_count:02d}",
                "detail": "hạng mục tôn vinh",
                "count": awards_count,
            },
            {
                "moduleId": "training",
                "label": "Hợp tác & Đào tạo",
                "value": f"{trainings_count:02d}",
                "detail": "chương trình đào tạo",
                "count": trainings_count,
            },
            {
                "moduleId": "forms",
                "label": "Biểu mẫu (Sheets)",
                "value": f"{forms_count:02d}",
                "detail": "đã kết nối đồng bộ",
                "count": forms_count,
            },
            {
                "moduleId": "contact",
                "label": "Hộp thư gửi đến",
                "value": f"{unread_submissions:02d}",
                "detail": f"{unread_submissions} thư chưa đọc",
                "count": total_submissions,
            },
        ]

        # 5 tin nhắn / phản hồi mới nhất
        recent_submissions = FormSubmission.query.order_by(FormSubmission.id.desc()).limit(5).all()
        recent_messages = [s.to_message_dict() for s in recent_submissions]

        # 5 hoạt động gần nhất
        recent_acts = ActivityLog.query.order_by(ActivityLog.id.desc()).limit(5).all()
        recent_activities = [a.to_dict() for a in recent_acts]

        return jsonify({
            "success": True,
            "data": {
                "counts": {
                    "events": events_count,
                    "projects": projects_count,
                    "records": records_count,
                    "awards": awards_count,
                    "trainings": trainings_count,
                    "forms": forms_count,
                    "submissions": total_submissions,
                    "unreadMessages": unread_submissions,
                    "users": users_count,
                },
                "stats": stats,
                "recentMessages": recent_messages,
                "recentActivities": recent_activities,
            }
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": f"Lỗi lấy thống kê: {str(e)}"}), 500

