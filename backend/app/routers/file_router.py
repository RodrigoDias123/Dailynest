from fastapi import APIRouter, Depends, Query
from typing import Optional
from sqlmodel import Session
from app.services.file_service import create_file, get_files, get_file_by_id, update_file, delete_file
from app.schemas.file_schema import FileCreate, FileUpdate, FilePublic
from app.core.database import get_session
from app.services.auth_service import get_current_user
from app.core.logging import logger

router = APIRouter(prefix="/files", tags=["Files"])


@router.post("/", response_model=FilePublic)
def create_file_route(
    data: FileCreate,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    logger.info("Attempting to create file for user: %s | File name: %s", current_user.email, data.file)

    try:
        file = create_file(db, data, current_user)
        logger.info("File created successfully (ID: %s) by user: %s", file.id, current_user.email)
        return file

    except Exception as exc:
        logger.exception("Unexpected error occurred while creating a new file")
        raise exc


@router.get("/", response_model=list[FilePublic])
def list_files_route(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    logger.info("User %s requested all files (category=%s)", current_user.id, category)
    try:
        return get_files(db, current_user, category)
    except Exception as exc:
        logger.exception("Unexpected error occurred while listing files for user %s", current_user.id)
        raise exc

@router.get("/{file_id}", response_model=FilePublic)
def get_file_route(
    file_id: int,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    logger.info("Fetching file ID %s for user: %s", file_id, current_user.email)

    try:
        return get_file_by_id(db, file_id, current_user)

    except Exception as exc:
        logger.exception("Unexpected error occurred while fetching file ID %s", file_id)
        raise exc


@router.patch("/{file_id}", response_model=FilePublic)
def update_file_route(
    file_id: int,
    data: FileUpdate,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    logger.info("Attempting to update file ID %s for user: %s", file_id, current_user.email)

    try:
        file = update_file(db, file_id, data, current_user)
        logger.info("File ID %s updated successfully by user: %s", file_id, current_user.email)
        return file

    except Exception as exc:
        logger.exception("Unexpected error occurred while updating file ID %s", file_id)
        raise exc


@router.delete("/{file_id}")
def delete_file_route(
    file_id: int,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    logger.info("Attempting to delete file ID %s for user: %s", file_id, current_user.email)

    try:
        delete_file(db, file_id, current_user)
        logger.info("File ID %s deleted successfully by user: %s", file_id, current_user.email)
        return {"detail": "File deleted successfully"}

    except Exception as exc:
        logger.exception("Unexpected error occurred while deleting file ID %s", file_id)
        raise exc
