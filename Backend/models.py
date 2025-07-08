from sqlalchemy import Column, Integer, String, ForeignKey, Date, Enum, DECIMAL, Text, JSON,Boolean, DateTime
from database import Base
from typing import Optional
import datetime
from sqlalchemy.orm import relationship

class Subscription(Base):
    __tablename__ = "subscription"

    id_Subscription = Column(Integer, primary_key=True, index=True)
    date_from = Column(Date, default=datetime.date.today, nullable=False)
    date_to = Column(Date, nullable=True)
    user_credit_amount = Column(Integer, default=0)
    ads_amount_per_day = Column(Integer, default=4)
    last_ads_reset = Column(Date, default=datetime.date.today)
    fk_Plan = Column(Integer, ForeignKey("plan.id_Plan"), default=1)
    # Optional: susiejimas su Plan lentele
    plan = relationship("Plan", back_populates="subscriptions")

class Plan(Base):
    __tablename__ = "plan"

    id_Plan = Column(Integer, primary_key=True, index=True)
    plan_name = Column(String(255), nullable=False)
    credit_amount = Column(Integer, default=0)
    duration_days = Column(Integer, default=30)
    price = Column(DECIMAL(10, 2), default=0.00)
    discount = Column(DECIMAL(5, 2), default=0.00)

    all_courses_access = Column(Boolean, default=True)
    courses_recommendations_access = Column(Boolean, default=False)
    all_job_access = Column(Boolean, default=True)
    job_recommendations_access = Column(Boolean, default=False)
    different_file_format_access = Column(Boolean, default=False)

    # Susiejimas su Subscription lentele
    subscriptions = relationship("Subscription", back_populates="plan")
    
class User(Base):
    __tablename__ = "user"  # Duomenų bazės lentelės pavadinimas

    id_User = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    fk_Subscription = Column(Integer, ForeignKey('subscription.id_Subscription'), default=1)

class CV(Base):
    __tablename__ = "cv"

    __tablename__ = "cv"
    id_CV = Column(Integer, primary_key=True, index=True, autoincrement=True)
    cv_text = Column(Text, nullable=True)
    fk_User = Column(Integer, ForeignKey("user.id_User"), nullable=False)

class Jobs(Base):
    __tablename__ = "jobs"
    id_Jobs = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    link = Column(String(500))
    image = Column(String(500))
    salary = Column(String(100))
    city = Column(String(100))
    company = Column(String(255))
    description = Column(Text)

class Course(Base):
    __tablename__ = "courses"

    id_Courses = Column(Integer, primary_key=True, index=True)
    Title = Column(String(255))
    Company = Column(String(255))
    Company_Logo = Column(String(255))
    Category = Column(String(255))
    Modules = Column(String(255))
    Stars = Column(DECIMAL(11, 1))
    Reviews = Column(Integer)
    Level = Column(String(255))
    Schedule = Column(String(255))
    Duration = Column(String(255))
    Skills = Column(Text)
    Description = Column(Text)
    Link = Column(Text)


class CVAnalysis(Base):
    __tablename__ = "cv_analysis"

    user_id = Column(Integer, ForeignKey("user.id_User", ondelete="CASCADE"), primary_key=True)
    skills = Column(Text, nullable=False)  
    is_IT = Column(Boolean, default=False, nullable=False)
    job_recommendations = Column(Text, nullable=False)  
    career_paths = Column(Text, nullable=False)  
    soft_skills = Column(Text, nullable=False)  

class CVTips(Base):
    __tablename__ = "cv_tips"
    user_id = Column(Integer, ForeignKey("user.id_User", ondelete="CASCADE"), primary_key=True)
    cv_tips = Column(Text, nullable=False)
    match_level = Column(String(30), nullable=False)
    summary_analysis = Column(Text, nullable=False)

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id_User"))
    stripe_session_id = Column(String(255))
    plan_id = Column(Integer, ForeignKey("plan.id_Plan"))
    amount = Column(DECIMAL(10, 2))
    currency = Column(String(10), default="eur")
    payment_status = Column(String(50))
    payment_date = Column(DateTime)

    plan = relationship("Plan")