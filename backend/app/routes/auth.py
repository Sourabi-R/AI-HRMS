from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.database import get_db
from app.models.user import User

from app.services.jwt_service import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter(prefix="/auth", tags=["Auth"])


# =========================
# REQUEST SCHEMAS
# =========================
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str = "employee"


class LoginRequest(BaseModel):
    email: str
    password: str


# =========================
# REGISTER
# =========================
@router.post("/register")
def register(user: RegisterRequest, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "role": new_user.role
    }


# =========================
# LOGIN
# =========================
@router.post("/login")
def login(user: LoginRequest, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    token = create_access_token({
        "user_id": db_user.id,
        "email": db_user.email,
        "role": db_user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": db_user.role
    }


# =========================
# ME (TEST TOKEN)
# =========================
@router.get("/me")
def get_me(user=Depends(lambda: None)):
    return {"message": "Token route placeholder"}