from sqlmodel import Session, select
from app.models.agenda_models import Agenda
from app.schemas.agenda_schema import AgendaCreate, AgendaUpdate
from app.core.logging import logger
from app.core.exceptions import NotFoundError, ValidationError


#Create new Event
def create_agenda(db: Session, data: AgendaCreate, current_user):
    agenda = Agenda(
        date=data.date,
        event=data.event,
        category=data.category,
        user_id=current_user.id
    )

    db.add(agenda)
    db.commit()
    db.refresh(agenda)

    logger.info("Agenda created for user %s", agenda.id, current_user.id)
    return agenda

#Get Event by ID
def get_agenda_by_id(db: Session, agenda_id: int, current_user):
    agenda = db.get(Agenda, agenda_id)

    if not agenda:
        logger.warning("Agenda %s not found", agenda_id)
        raise NotFoundError("Agenda entry not found")
        

    if agenda.user_id != current_user.id:
        logger.error("User %s attempted to access agenda %s owned by user %s", current_user.id, agenda_id, agenda.user_id)
        raise ValidationError("Not allowed")

    return agenda

#Get all events
def get_agendas(db: Session, current_user, category=None):
    query = select(Agenda).where(Agenda.user_id == current_user.id)
    if category:
        query = query.where(Agenda.category == category)
    agendas = db.exec(query).all()

    logger.info("User %s fetched %s agendas", current_user.id, len(agendas))
    return agendas

#Update Event
def update_agenda(db: Session, agenda_id: int, data: AgendaUpdate, current_user):
    agenda = get_agenda_by_id(db, agenda_id, current_user)

    if data.date is not None:
        agenda.date = data.date

    if data.event is not None:
        agenda.event = data.event

    if data.category is not None:
        agenda.category = data.category

    db.add(agenda)
    db.commit()
    db.refresh(agenda)

    logger.info("Agenda %s updated for user %s", agenda_id, current_user.id)
    return agenda

#Delete Event
def delete_agenda(db: Session, agenda_id: int, current_user):
    agenda = get_agenda_by_id(db, agenda_id, current_user)

    db.delete(agenda)
    db.commit()

    logger.info("Agenda %s deleted for user %s", agenda_id, current_user.id)
    return {"detail": "Agenda entry deleted successfully"}