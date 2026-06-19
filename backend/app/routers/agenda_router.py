from fastapi import APIRouter, Depends, Query
from typing import Optional
from sqlmodel import Session
from app.services.agenda_service import create_agenda, get_agendas, get_agenda_by_id, update_agenda, delete_agenda
from app.schemas.agenda_schema import AgendaCreate, AgendaUpdate, AgendaPublic
from app.core.database import get_session
from app.services.auth_service import get_current_user
from app.core.logging import logger

router = APIRouter(prefix="/agendas", tags=["Agendas"])


@router.post("/", response_model=AgendaPublic)
def create_agenda_route(
    data: AgendaCreate,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    logger.info("User %s requested to create an agenda", current_user.id)
    try:
        return create_agenda(db, data, current_user)
    except Exception as exc:
        logger.exception("Unexpected error occurred while creating agenda for user %s", current_user.id)
        raise exc


@router.get("/", response_model=list[AgendaPublic])
def list_agendas_route(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    logger.info("User %s requested all agendas (category=%s)", current_user.id, category)
    try:
        return get_agendas(db, current_user, category)
    except Exception as exc:
        logger.exception("Unexpected error occurred while listing agendas for user %s", current_user.id)
        raise exc


@router.get("/{agenda_id}", response_model=AgendaPublic)
def get_agenda_route(
    agenda_id: int,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    logger.info("User %s requested agenda %s", current_user.id, agenda_id)
    try:
        return get_agenda_by_id(db, agenda_id, current_user)
    except Exception as exc:
        logger.exception("Unexpected error occurred while retrieving agenda %s for user %s", agenda_id, current_user.id)
        raise exc


@router.patch("/{agenda_id}", response_model=AgendaPublic)
def update_agenda_route(
    agenda_id: int,
    data: AgendaUpdate,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    logger.info("User %s requested to update agenda %s", current_user.id, agenda_id)
    try:
        return update_agenda(db, agenda_id, data, current_user)
    except Exception as exc:
        logger.exception("Unexpected error occurred while updating agenda %s for user %s", agenda_id, current_user.id)
        raise exc

@router.delete("/{agenda_id}")
def delete_agenda_route(
    agenda_id: int,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    logger.info("User %s requested to delete agenda %s", current_user.id, agenda_id)
    try:
        return delete_agenda(db, agenda_id, current_user)
    except Exception as exc:
        logger.exception("Unexpected error occurred while trying to delete agenda %s for user %s", agenda_id, current_user.id)