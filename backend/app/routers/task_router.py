from fastapi import APIRouter, Depends, Query
from typing import Optional
from sqlmodel import Session
from app.services.task_service import create_task, get_tasks, get_task_by_id, update_task, delete_task
from app.schemas.task_schema import TaskCreate, TaskUpdate, TaskPublic
from app.core.database import get_session
from app.services.auth_service import get_current_user
from app.core.logging import logger

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("/", response_model=TaskPublic)
def create_task_route(
    data: TaskCreate,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    logger.info("Attempting to create task for user: %s | Title: %s", current_user.email, data.title)

    try:
        task = create_task(db, data, current_user)
        logger.info("Task created successfully (ID: %s) by user: %s", task.id, current_user.email)
        return task

    except Exception as exc:
        logger.exception("Unexpected error occurred while creating a new task")
        raise exc


@router.get("/", response_model=list[TaskPublic])
def list_tasks_route(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    logger.info("User %s requested all tasks (category=%s)", current_user.id, category)
    try:
        return get_tasks(db, current_user, category)
    except Exception as exc:
        logger.exception("Unexpected error occurred while listing tasks for user %s", current_user.id)
        raise exc


@router.get("/{task_id}", response_model=TaskPublic)
def get_task_route(
    task_id: int,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    logger.info("Fetching task ID %s for user: %s", task_id, current_user.email)

    try:
        return get_task_by_id(db, task_id, current_user)

    except Exception as exc:
        logger.exception("Unexpected error occurred while fetching task ID %s", task_id)
        raise exc


@router.patch("/{task_id}", response_model=TaskPublic)
def update_task_route(
    task_id: int,
    data: TaskUpdate,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    logger.info("Attempting to update task ID %s for user: %s", task_id, current_user.email)

    try:
        task = update_task(db, task_id, data, current_user)
        logger.info("Task ID %s updated successfully by user: %s", task_id, current_user.email)
        return task

    except Exception as exc:
        logger.exception("Unexpected error occurred while updating task ID %s", task_id)
        raise exc


@router.delete("/{task_id}")
def delete_task_route(
    task_id: int,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    logger.info("Attempting to delete task ID %s for user: %s", task_id, current_user.email)

    try:
        delete_task(db, task_id, current_user)
        logger.info("Task ID %s deleted successfully by user: %s", task_id, current_user.email)
        return {"detail": "Task deleted successfully"}

    except Exception as exc:
        logger.exception("Unexpected error occurred while deleting task ID %s", task_id)
        raise exc
