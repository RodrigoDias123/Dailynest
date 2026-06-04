from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.services.task_service import (create_task, get_tasks, get_task_by_id, update_task, delete_task)
from app.schemas.task_schema import TaskCreate, TaskUpdate, TaskPublic
from app.core.database import get_session
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("/", response_model=TaskPublic)
def create_task_route(
    data: TaskCreate,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return create_task(db, data, current_user)


@router.get("/", response_model=list[TaskPublic])
def list_tasks_route(
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return get_tasks(db, current_user)


@router.get("/{task_id}", response_model=TaskPublic)
def get_task_route(
    task_id: int,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return get_task_by_id(db, task_id, current_user)


@router.patch("/{task_id}", response_model=TaskPublic)
def update_task_route(
    task_id: int,
    data: TaskUpdate,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return update_task(db, task_id, data, current_user)


@router.delete("/{task_id}")
def delete_task_route(
    task_id: int,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return delete_task(db, task_id, current_user)
