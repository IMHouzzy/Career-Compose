# database.py:

from sqlalchemy import create_engine, Column, Integer, String, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:@localhost:3306/pvp" 

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"charset": "utf8mb4"}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# pasibandymui
try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("Database is accessible!")
except Exception as e:
    print(f"Error connecting to the database: {e}")



