from pydantic import BaseModel
from datetime import date
from typing import Optional

class UserCreate(BaseModel):
    name: str
    last_name: str
    email: str
    password: str

    class Config:
         from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str


class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id_User: int
    name: str
    last_name: str
    email: str
    fk_Subscription: int

    class Config:
        from_attributes = True 

class UserUpdateRequest(BaseModel):
    token: str
    name: str
    last_name: str
    email: str
    current_password: Optional[str] = None
    new_password: Optional[str] = None
    repeat_password: Optional[str] = None

class JobResponse(BaseModel):
    id_Jobs: int
    title: str
    link: str
    image: str
    salary: str
    city: str
    company: str
    description: str

    class Config:
        from_attributes = True

class CourseResponse(BaseModel):
    id_Courses: int
    Title: str
    Company: str
    Company_Logo: str
    Category: str
    Modules: str
    Stars: float
    Reviews: int
    Level: str
    Schedule: str
    Duration: str
    Skills: str
    Description: str
    Link: str

    class Config:
        from_attributes = True

class ExperienceInput(BaseModel):
    experience: str

class SubscriptionResponse(BaseModel):
    id_Subscription: int
    date_from: date
    date_to: Optional[date]
    user_credit_amount: int
    ads_amount_per_day: int
    fk_Plan: int

    class Config:
        from_attributes = True
class WatchedAdRequest(BaseModel):
    watched_ads: int