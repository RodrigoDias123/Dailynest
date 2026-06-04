from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.services.user_service import get_profile, update_user, delete_user
from app.schemas.user_schema import UserPublic, UserUpdate
from app.core.database import get_session
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/profile", response_model=UserPublic)
def get_profile_route(
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return get_profile(db, current_user)


@router.patch("/profile", response_model=UserPublic)
def update_profile_route(
    data: UserUpdate,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return update_user(db, data, current_user)


@router.delete("/profile")
def delete_profile_route(
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return delete_user(db, current_user)
