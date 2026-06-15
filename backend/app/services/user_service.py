from sqlmodel import Session, select
from app.models.user_models import User
from app.schemas.user_schema import UserUpdate
from app.services.auth_service import hash_password
from app.core.logging import logger
from app.core.exceptions import NotFoundError, ValidationError


#Get User by ID
def get_user_by_id(db: Session, user_id: int):
    user = db.get(User, user_id)

    if not user:
        logger.warning("User %s not found", user_id)
        raise NotFoundError("User not found")

    return user


#Get Profile
def get_profile(db: Session, current_user):
    logger.info("User %s fetched profile", current_user.id)
    return get_user_by_id(db, current_user.id)


#Update Account
def update_user(db: Session, data: UserUpdate, current_user):
    user = get_user_by_id(db, current_user.id)

    #Email update
    if data.email and data.email != user.email:
        existing = db.exec(select(User).where(User.email == data.email)).first()

        if existing:
            logger.warning("User %s attempted to update email to %s which is already in use", current_user.id, data.email)
            raise ValidationError("Email already in use")

        user.email = data.email

    #Name update
    if data.name is not None:
        user.name = data.name

    #Password update
    if data.password is not None:
        user.password = hash_password(data.password)

    db.add(user)
    db.commit()
    db.refresh(user)

    logger.info("User %s updated account information", current_user.id)
    return user


#Delete Account
def delete_user(db: Session, current_user):
    user = get_user_by_id(db, current_user.id)

    db.delete(user)
    db.commit()

    logger.info("User %s deleted their account", current_user.id)
    return {"detail": "User account deleted successfully"}