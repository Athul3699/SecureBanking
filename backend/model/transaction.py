from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, Enum
from base import Base
import enum

class TransactionType(enum.Enum):
    credit = 0,
    debit = 1,
    cashier_cheque = 2,
    transfer = 3,
    email = 4,
    phone = 5

class TransactionStatus(enum.Enum):
    approved = 0,
    awaiting_otp = 1,
    awaiting_approval = 2,
    cancelled = 3

class Transaction(Base):
    __tablename__ = 'bank_account'

    id = Column(Integer, primary_key=True, nullable=False)
    initiated_time = Column(DateTime, nullable=False)
    type = Column(Enum(TransactionType), nullable=False, default=TransactionType.transfer)
    initiated_by = Column(String, nullable=False)
    from_account = Column(Integer, nullable=False)
    to_account = Column(Integer, nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(Enum(TransactionStatus), nullable=False)
    awaiting_action_from_authorization_level = Column(String, nullable=False)
    last_approved_by = Column(Integer, nullable=False)
    last_approved_time = Column(DateTime, nullable=False)
    otp_needed = Column(Boolean, nullable=False, default=True)
    otp_time_sent = Column(DateTime, nullable=False)
    otp_valid_until = Column(DateTime, nullable=False)
