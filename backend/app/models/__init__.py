"""
Database Models (SQLModel ORM Tables)

This module contains the SQLModel classes that define the structure of the
database tables used by the application. These models represent the persistent
data layer and are responsible for describing how information is stored,
related, and constrained inside the database.

Key responsibilities of database models:

1. Table Definitions
   Each model with `table=True` corresponds to a real database table.
   Fields map directly to columns, including types, defaults, indexes,
   uniqueness constraints, and primary keys.

2. Relationships
   Models define how tables relate to each other using SQLModel/SQLAlchemy
   relationships. This includes:
   - One‑to‑many (e.g., User → Tasks)
   - Many‑to‑one (e.g., Task → User)
   - Cascading rules for deletes and updates

3. Persistence Logic
   Models are used by the ORM to:
   - Create tables
   - Insert, update, and delete rows
   - Execute queries
   - Manage foreign keys and constraints

4. Separation from Schemas
   Models represent the *database layer*, while schemas represent the
   *API layer*. Models may contain internal fields (e.g., hashed passwords,
   foreign keys, relationships) that should never be exposed directly to
   clients.

In summary, models define how data is stored and connected in the database,
while schemas define how data is sent and received through the API. Keeping
these layers separate ensures a clean, secure, and maintainable architecture.
"""
