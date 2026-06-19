from sqlmodel import Session, select
from app.models.task_models import Task
from app.schemas.task_schema import TaskCreate, TaskUpdate
from app.core.logging import logger
from app.core.exceptions import NotFoundError, ValidationError


#Create Task
def create_task(db: Session, data: TaskCreate, current_user):
    task = Task(
        title=data.title,
        description=data.description,
        category=data.category,
        status=data.status,
        priority=data.priority,
        user_id=current_user.id
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    logger.info("Task %s created for user %s", task.id, current_user.id)
    return task


#Get Task by ID
def get_task_by_id(db: Session, task_id: int, current_user):
    task = db.get(Task, task_id)

    if not task:
        logger.warning("Task %s not found", task_id)
        raise NotFoundError("Task not found")

    if task.user_id != current_user.id:
        logger.error("User %s attempted to access task %s owned by user %s", current_user.id, task_id, task.user_id)
        raise ValidationError("Not allowed")

    return task


#Get all Tasks
def get_tasks(db: Session, current_user, category=None):
    query = select(Task).where(Task.user_id == current_user.id)
    if category:
        query = query.where(Task.category == category)
    tasks = db.exec(query).all()

    logger.info("User %s fetched %s tasks", current_user.id, len(tasks))
    return tasks


#Update Task
def update_task(db: Session, task_id: int, data: TaskUpdate, current_user):
    task = get_task_by_id(db, task_id, current_user)

    if data.title is not None:
        task.title = data.title

    if data.description is not None:
        task.description = data.description

    if data.category is not None:
        task.category = data.category

    if data.status is not None:
        task.status = data.status

    if data.priority is not None:
        task.priority = data.priority

    db.add(task)
    db.commit()
    db.refresh(task)

    logger.info("Task %s updated for user %s", task_id, current_user.id)
    return task


#Delete Task
def delete_task(db: Session, task_id: int, current_user):
    task = get_task_by_id(db, task_id, current_user)

    db.delete(task)
    db.commit()

    logger.info("Task %s deleted for user %s", task_id, current_user.id)
    return {"detail": "Task deleted successfully"}