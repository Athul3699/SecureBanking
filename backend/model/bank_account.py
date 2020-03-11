from sqlalchemy import Column, Integer, String, Float, Enum
from base import Base
import enum

class BankAccountType(enum.Enum):
    checkings = 0,
    savings = 1

class BankAccount(Base):
    __tablename__ = 'bank_account'

    id = Column(Integer, primary_key=True, nullable=False)
    bank_account_number = Column(Integer, nullable=False)
    bank_account_type = Column(Enum(BankAccountType), nullable=False)
    routing_number = Column(String, nullable=False)
    user_id = Column(String, nullable=False)
    account_balance = Column(Float, nullable=False)
