from app import create_app
from extensions import db
from models.UserModel import User, RoleEnum
from sqlalchemy import text

app = create_app()

with app.app_context():
    # 1. Xóa bảng user_login_history nếu còn tồn tại
    try:
        db.session.execute(text("DROP TABLE IF EXISTS user_login_history;"))
        db.session.commit()
        print("-> Đã xóa bảng user_login_history khỏi Database.")
    except Exception as e:
        print(f"Lỗi khi xóa bảng login history: {e}")

    # 2. Xóa các tài khoản cũ không còn dùng (editor, normal_user)
    try:
        db.session.execute(text("DELETE FROM user WHERE username IN ('editor', 'normal_user');"))
        db.session.commit()
    except Exception as e:
        print(f"Lỗi dọn dẹp user cũ: {e}")

    # 3. Khởi tạo 2 tài khoản quản trị: admin và manager
    accounts = [
        {
            "username": "admin",
            "email": "admin@vietkings.org",
            "password": "admin123",
            "full_name": "Quản Trị Viên (Admin)",
            "role": RoleEnum.ADMIN.value,
            "can_admin_access": True,
        },
        {
            "username": "manager",
            "email": "manager@vietkings.org",
            "password": "manager123",
            "full_name": "Quản Lý (Manager)",
            "role": RoleEnum.MANAGER.value,
            "can_admin_access": True,
        },
    ]

    for acc in accounts:
        user = User.query.filter_by(username=acc["username"]).first()
        if not user:
            user = User(
                username=acc["username"],
                email=acc["email"],
                full_name=acc["full_name"],
                role=acc["role"],
                is_active=True,
                can_admin_access=acc["can_admin_access"],
            )
            user.set_password(acc["password"])
            db.session.add(user)
            print(f"Created account: {acc['username']} ({acc['role']})")
        else:
            user.email = acc["email"]
            user.full_name = acc["full_name"]
            user.role = acc["role"]
            user.is_active = True
            user.can_admin_access = acc["can_admin_access"]
            user.set_password(acc["password"])
            print(f"Updated account: {acc['username']} ({acc['role']})")

    db.session.commit()
    print("-> Hoàn tất cấu hình 2 tài khoản: 'admin' và 'manager' trong Database!")
