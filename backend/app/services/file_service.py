from sqlmodel import Session, select
from app.models.file_models import File
from app.schemas.file_schema import FileCreate, FileUpdate
from app.core.logging import logger
from app.core.exceptions import NotFoundError, ValidationError


#Create File
def create_file(db: Session, data: FileCreate, current_user):
    file = File(
        filename=data.filename,
        filepath=data.filepath,
        category=data.category,
        user_id=current_user.id
    )

    db.add(file)
    db.commit()
    db.refresh(file)

    logger.info("File %s created for user %s", file.id, current_user.id)
    return file


#Get File by ID
def get_file_by_id(db: Session, file_id: int, current_user):
    file = db.get(File, file_id)

    if not file:
        logger.warning("File %s not found", file_id)
        raise NotFoundError("File not found")

    if file.user_id != current_user.id:
        logger.error("User %s attempted to access file %s owned by user %s", current_user.id, file_id, file.user_id)
        raise ValidationError("Not allowed")

    return file


#Get all Files
def get_files(db: Session, current_user, category=None):
    query = select(File).where(File.user_id == current_user.id)
    if category:
        query = query.where(File.category == category)
    files = db.exec(query).all()

    logger.info("User %s fetched %s files", current_user.id, len(files))
    return files


#Update File
def update_file(db: Session, file_id: int, data: FileUpdate, current_user):
    file = get_file_by_id(db, file_id, current_user)

    if data.filename is not None:
        file.filename = data.filename

    if data.filepath is not None:
        file.filepath = data.filepath

    if data.category is not None:
        file.category = data.category

    db.add(file)
    db.commit()
    db.refresh(file)

    logger.info("File %s updated for user %s", file_id, current_user.id)
    return file


#Delete File
def delete_file(db: Session, file_id: int, current_user):
    file = get_file_by_id(db, file_id, current_user)

    db.delete(file)
    db.commit()

    logger.info("File %s deleted for user %s", file_id, current_user.id)
    return {"detail": "File deleted successfully"}