from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.services.auth_service import register_user, login_user
from app.schemas.user_schema import UserCreate, Token, UserLogin
from app.core.database import get_session
from app.core.logging import logger


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=Token)
def register_route(
    data: UserCreate,
    db: Session = Depends(get_session)
):
    logger.info("Attempting to register user: %s", data.email)

    try:
        user = register_user(db, data)
        logger.info("User registered successfully: %s", user.email)
        token_data = login_user(db, user.email, data.password)
        logger.info("Token generated for new user: %s", user.email)

        return token_data

    except Exception as exc:
        logger.exception("Unexpected error occurred while creating a new account")
        raise exc


@router.post("/login", response_model=Token)
def login_route(
    data: UserLogin,
    db: Session = Depends(get_session)
):
    logger.info("Loggin attempt for user: %s", data.email)

    try:
        token = login_user(db, data.email, data.password)
        logger.info("User logged in successfully: %s", data.email)
        
        return token

    except Exception as exc:
        logger.exception("Unexpected error occurred while attempting to login")
        raise exc