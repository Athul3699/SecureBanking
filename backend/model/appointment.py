from sqlalchemy import Column, Integer, String, DateTime
from base import Base

import datetime

class Appointment(Base):
    __tablename__ = 'appointment'

    id = Column(Integer, primary_key=True, nullable=False)
    appointment_time = Column(DateTime, nullable=False)
    user_id = Column(String, nullable=False)
    appointment_reason = Column(String, nullable=True, default="")
