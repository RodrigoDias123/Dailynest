from sqlmodel import Session, select
from app.models.notepad_models import Notepad
from app.schemas.notepad_schema import NotepadCreate, NotepadUpdate
from app.core.logging import logger
from app.core.exceptions import NotFoundError, ValidationError


#Create Note
def create_notepad(db: Session, data: NotepadCreate, current_user):
    notepad = Notepad(
        title=data.title,
        content=data.content,
        category=data.category,
        user_id=current_user.id
    )

    db.add(notepad)
    db.commit()
    db.refresh(notepad)

    logger.info("Notepad %s created for user %s", notepad.id, current_user.id)
    return notepad


#Get Note by ID
def get_notepad_by_id(db: Session, notepad_id: int, current_user):
    notepad = db.get(Notepad, notepad_id)

    if not notepad:
        logger.warning("Notepad %s not found", notepad_id)
        raise NotFoundError("Notepad entry not found")

    if notepad.user_id != current_user.id:
        logger.error(
            "User %s attempted to access notepad %s owned by user %s",
            current_user.id, notepad_id, notepad.user_id
        )
        raise ValidationError("Not allowed")

    return notepad


#Get all Notes
def get_notepads(db: Session, current_user, category=None):
    query = select(Notepad).where(Notepad.user_id == current_user.id)
    if category:
        query = query.where(Notepad.category == category)
    notepads = db.exec(query).all()

    logger.info("User %s fetched %s notepads", current_user.id, len(notepads))
    return notepads


#Update Note
def update_notepad(db: Session, notepad_id: int, data: NotepadUpdate, current_user):
    notepad = get_notepad_by_id(db, notepad_id, current_user)

    if data.title is not None:
        notepad.title = data.title

    if data.content is not None:
        notepad.content = data.content

    if data.category is not None:
        notepad.category = data.category

    db.add(notepad)
    db.commit()
    db.refresh(notepad)

    logger.info("Notepad %s updated for user %s", notepad_id, current_user.id)
    return notepad


#Delete Note
def delete_notepad(db: Session, notepad_id: int, current_user):
    notepad = get_notepad_by_id(db, notepad_id, current_user)

    db.delete(notepad)
    db.commit()

    logger.info("Notepad %s deleted for user %s", notepad_id, current_user.id)
    return {"detail": "Notepad entry deleted successfully"}