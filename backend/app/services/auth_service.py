from datetime import datetime, timedelta
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from sqlmodel import Session, select
from app.models.user_models import User
from app.schemas.user_schema import UserCreate, Token, TokenData
from app.core.config import settings
from app.core.database import get_session
from app.core.logging import logger
from app.core.exceptions import NotFoundError, ValidationError
import jwt


#Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


#Create Token
def create_access_token(data: dict, expires_minutes: int = settings.ACCESS_TOKEN_EXPIRE_MINUTES):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})

    logger.info("Access token created for user %s", data.get("sub"))
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


#Register
def register_user(db: Session, data: UserCreate):
    existing = db.exec(select(User).where(User.email == data.email)).first()

    if existing:
        logger.warning("Attempt to register with existing email %s", data.email)
        raise ValidationError("Email already registered")

    user = User(
        name=data.name,
        email=data.email,
        password=hash_password(data.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    logger.info("User %s registered successfully", user.id)
    return user


#Authentication
def authenticate_user(db: Session, email: str, password: str):
    user = db.exec(select(User).where(User.email == email)).first()

    if not user:
        logger.warning("Login failed: email %s not found", email)
        raise ValidationError("Invalid email or password")

    if not verify_password(password, user.password):
        logger.warning("Login failed: incorrect password for email %s", email)
        raise ValidationError("Invalid email or password")

    logger.info("User %s authenticated successfully", user.id)
    return user


#Get User from Token
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_session)
):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")

        if user_id is None:
            logger.error("Token missing subject (sub)")
            raise ValidationError("Invalid token")

        token_data = TokenData(user_id=int(user_id))

    except jwt.ExpiredSignatureError:
        logger.warning("Expired token used")
        raise ValidationError("Token expired")

    except jwt.InvalidTokenError:
        logger.error("Invalid token provided")
        raise ValidationError("Invalid token")

    user = db.get(User, token_data.user_id)

    if not user:
        logger.error("Token user %s not found in database", token_data.user_id)
        raise NotFoundError("User not found")

    logger.info("Authenticated user %s via token", user.id)
    return user


#Login
def login_user(db: Session, email: str, password: str):
    user = authenticate_user(db, email, password)
    access_token = create_access_token({"sub": str(user.id)})

    logger.info("User %s logged in successfully", user.id)
    return Token(access_token=access_token)