from sqlalchemy import Column, Integer, String
from base import Base
import sys

# demo class, to add sqldialect for postgresql soon
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String)

    def repr(self):
        return "<User (name='%s', id='%d')>" % (self.name, self.id)


a_user = User(name='Ronak Tanna', id=1)
# session.add(a_user)


print(a_user.name)