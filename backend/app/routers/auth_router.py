from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.services.auth_service import register_user, login_user
from app.schemas.user_schema import UserCreate, Token, UserLogin
from app.core.database import get_session

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=Token)
def register_route(
    data: UserCreate,
    db: Session = Depends(get_session)
):
    user = register_user(db, data)
    token_data = login_user(db, user.email, data.password)
    return token_data


@router.post("/login", response_model=Token)
def login_route(
    data: UserLogin,
    db: Session = Depends(get_session)
):
    return login_user(db, data.email, data.password)
