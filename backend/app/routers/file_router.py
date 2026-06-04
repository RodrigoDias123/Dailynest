from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.services.file_service import create_file, get_files, get_file_by_id, update_file, delete_file
from app.schemas.file_schema import FileCreate, FileUpdate, FilePublic
from app.core.database import get_session
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/files", tags=["Files"])


@router.post("/", response_model=FilePublic)
def create_file_route(
    data: FileCreate,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return create_file(db, data, current_user)


@router.get("/", response_model=list[FilePublic])
def list_files_route(
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return get_files(db, current_user)


@router.get("/{file_id}", response_model=FilePublic)
def get_file_route(
    file_id: int,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return get_file_by_id(db, file_id, current_user)


@router.patch("/{file_id}", response_model=FilePublic)
def update_file_route(
    file_id: int,
    data: FileUpdate,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return update_file(db, file_id, data, current_user)


@router.delete("/{file_id}")
def delete_file_route(
    file_id: int,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return delete_file(db, file_id, current_user)
