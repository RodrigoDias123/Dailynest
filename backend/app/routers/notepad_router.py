from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.services.notepad_service import create_notepad, get_notepads, get_notepad_by_id, update_notepad, delete_notepad
from app.schemas.notepad_schema import NotepadCreate, NotepadUpdate, NotepadPublic
from app.core.database import get_session
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/notepads", tags=["Notepads"])


@router.post("/", response_model=NotepadPublic)
def create_notepad_route(
    data: NotepadCreate,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return create_notepad(db, data, current_user)


@router.get("/", response_model=list[NotepadPublic])
def list_notepads_route(
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return get_notepads(db, current_user)


@router.get("/{notepad_id}", response_model=NotepadPublic)
def get_notepad_route(
    notepad_id: int,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return get_notepad_by_id(db, notepad_id, current_user)


@router.patch("/{notepad_id}", response_model=NotepadPublic)
def update_notepad_route(
    notepad_id: int,
    data: NotepadUpdate,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return update_notepad(db, notepad_id, data, current_user)


@router.delete("/{notepad_id}")
def delete_notepad_route(
    notepad_id: int,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return delete_notepad(db, notepad_id, current_user)
