from fastapi import APIRouter, Depends, Query
from typing import Optional
from sqlmodel import Session
from app.services.notepad_service import create_notepad, get_notepads, get_notepad_by_id, update_notepad, delete_notepad
from app.schemas.notepad_schema import NotepadCreate, NotepadUpdate, NotepadPublic
from app.core.database import get_session
from app.services.auth_service import get_current_user
from app.core.logging import logger

router = APIRouter(prefix="/notepads", tags=["Notepads"])


@router.post("/", response_model=NotepadPublic)
def create_notepad_route(
    data: NotepadCreate,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    logger.info("Attempting to create notepad for user: %s | Title: %s", current_user.email, data.title)

    try:
        notepad = create_notepad(db, data, current_user)
        logger.info("Notepad created successfully (ID: %s) by user: %s", notepad.id, current_user.email)
        return notepad

    except Exception as exc:
        logger.exception("Unexpected error occurred while creating a new notepad")
        raise exc


@router.get("/", response_model=list[NotepadPublic])
def list_notepads_route(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    logger.info("User %s requested all notes (category=%s)", current_user.id, category)
    try:
        return get_notepads(db, current_user, category)
    except Exception as exc:
        logger.exception("Unexpected error occurred while listing notes for user %s", current_user.id)
        raise exc


@router.get("/{notepad_id}", response_model=NotepadPublic)
def get_notepad_route(
    notepad_id: int,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    logger.info("Fetching notepad ID %s for user: %s", notepad_id, current_user.email)

    try:
        return get_notepad_by_id(db, notepad_id, current_user)

    except Exception as exc:
        logger.exception("Unexpected error occurred while fetching notepad ID %s", notepad_id)
        raise exc


@router.patch("/{notepad_id}", response_model=NotepadPublic)
def update_notepad_route(
    notepad_id: int,
    data: NotepadUpdate,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    logger.info("Attempting to update notepad ID %s for user: %s", notepad_id, current_user.email)

    try:
        notepad = update_notepad(db, notepad_id, data, current_user)
        logger.info("Notepad ID %s updated successfully by user: %s", notepad_id, current_user.email)
        return notepad

    except Exception as exc:
        logger.exception("Unexpected error occurred while updating notepad ID %s", notepad_id)
        raise exc


@router.delete("/{notepad_id}")
def delete_notepad_route(
    notepad_id: int,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    logger.info("Attempting to delete notepad ID %s for user: %s", notepad_id, current_user.email)

    try:
        delete_notepad(db, notepad_id, current_user)
        logger.info("Notepad ID %s deleted successfully by user: %s", notepad_id, current_user.email)
        return {"detail": "Notepad deleted successfully"}

    except Exception as exc:
        logger.exception("Unexpected error occurred while deleting notepad ID %s", notepad_id)
        raise exc
