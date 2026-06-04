from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.services.agenda_service import create_agenda, get_agendas, get_agenda_by_id, update_agenda, delete_agenda
from app.schemas.agenda_schema import AgendaCreate, AgendaUpdate, AgendaPublic
from app.core.database import get_session
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/agendas", tags=["Agendas"])


@router.post("/", response_model=AgendaPublic)
def create_agenda_route(
    data: AgendaCreate,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return create_agenda(db, data, current_user)


@router.get("/", response_model=list[AgendaPublic])
def list_agendas_route(
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return get_agendas(db, current_user)


@router.get("/{agenda_id}", response_model=AgendaPublic)
def get_agenda_route(
    agenda_id: int,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return get_agenda_by_id(db, agenda_id, current_user)


@router.patch("/{agenda_id}", response_model=AgendaPublic)
def update_agenda_route(
    agenda_id: int,
    data: AgendaUpdate,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return update_agenda(db, agenda_id, data, current_user)


@router.delete("/{agenda_id}")
def delete_agenda_route(
    agenda_id: int,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return delete_agenda(db, agenda_id, current_user)
