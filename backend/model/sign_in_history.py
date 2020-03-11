from sqlalchemy import Column, Integer, String, DateTime, Enum
from base import Base
from datetime import datetime
import enum

class LogoutReason(enum.Enum):
    user_initiated_logout = 0,
    session_timeout = 1

class SignInHistory(Base):
    __tablename__ = 'sign_in_history'

    id = Column(Integer, primary_key=True, nullable=False)
    login_time = Column(DateTime, nullable=False, default=datetime.now())
    user_id = Column(String, nullable=False)
    logout_time = Column(DateTime, nullable=False, default=datetime.now())
    logout_reason = Column(Enum(LogoutReason), nullable=False, default=LogoutReason.user_initiated_logout)

history = SignInHistory(id=0, user_id="0")

print(history)
print(history.id)
print(history.login_time)
print(history.user_id)
print(history.logout_time)
print(history.logout_reason)