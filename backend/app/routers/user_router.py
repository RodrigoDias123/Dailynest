from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.services.user_service import get_profile, update_user, delete_user
from app.schemas.user_schema import UserPublic, UserUpdate
from app.core.database import get_session
from app.services.auth_service import get_current_user
from app.core.logging import logger

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/profile", response_model=UserPublic)
def get_profile_route(
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    logger.info("Fetching profile for user: %s", current_user.email)

    try:
        return get_profile(db, current_user)

    except Exception as exc:
        logger.exception("Unexpected error occurred while fetching user profile")
        raise exc


@router.patch("/profile", response_model=UserPublic)
def update_profile_route(
    data: UserUpdate,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    logger.info("Attempting to update profile for user: %s", current_user.email)

    try:
        updated_user = update_user(db, data, current_user)
        logger.info("Profile updated successfully for user: %s", current_user.email)
        return updated_user

    except Exception as exc:
        logger.exception("Unexpected error occurred while updating user profile")
        raise exc


@router.delete("/profile")
def delete_profile_route(
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    logger.info("Attempting to delete profile for user: %s", current_user.email)

    try:
        delete_user(db, current_user)
        logger.info("Profile deleted successfully for user: %s", current_user.email)
        return {"detail": "User profile deleted successfully"}

    except Exception as exc:
        logger.exception("Unexpected error occurred while deleting user profile")
        raise exc
