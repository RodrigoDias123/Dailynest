Ai use in core, models, schemas, services, router and in the docker compose, help to set the db, configs and all the other stufs, and help to decide between using vscode postgresql extension or pgadmin, I choose pgadmin, because I was not  working well with the extension, so pgadmin was a better choise for now, I took the idea of how can I work with postgreSQL from a tiktok that I watch and after that I Started changing the code to be able to work with my tables, but the cod that I watch was not good for multiple tables and Relationships, so I used the AI to fix imports, endpoints, some errors in the models and schemas.

AI give me this structure idea 

    project/
    │
    ├── core/
    │   └── database.py        ← engine, SessionLocal, Base
    │
    ├── models/
    │   └── user.py            ← SQLAlchemy ORM models
    │
    ├── schemas/
    │   └── user.py            ← Pydantic request/response models
    │
    ├── services/
    │   └── user_service.py    ← business logic (uses CRUD)
    │
    ├── services/
    │   └── user.py            ← actual SQL queries
    │
    └── routers/
        └── user.py            ← API endpoints

correct progression
    router → schema(validation) -> service(queries) → model(structure) → database

multiple dockerfile configs
https://stackoverflow.com/questions/27409761/docker-multiple-dockerfiles-in-project

register validations
https://stackoverflow.com/questions/5142103/regex-to-validate-password-strength
https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript