"""
Service Layer (Business Logic)

This module contains the service functions that implement the core business
logic of the application. Services sit between the routers and the database,
ensuring that all meaningful operations are handled in a single, reusable,
and testable place.

Key responsibilities of the service layer:

1. Business Logic
   Services contain all the rules and operations that define how the
   application behaves. This includes creating, reading, updating, and
   deleting resources, as well as enforcing domain-specific constraints
   such as ownership validation and data integrity checks.

2. Ownership & Authorization
   Before performing any operation on a resource, services verify that
   the requesting user is the owner. This prevents users from accessing
   or modifying data that does not belong to them, keeping the application
   secure without cluttering the router layer with authorization logic.

3. Database Interaction
   Services receive a scoped database session from the router and use it
   to query, insert, update, and delete records via SQLModel and SQLAlchemy.
   All database commits and refreshes are handled here, ensuring the router
   layer never touches persistence logic directly.

4. Exception Handling
   Services raise custom exceptions defined in the core layer — such as
   `NotFoundError` and `ValidationError` — when expected error conditions
   occur. This keeps error handling consistent and allows routers to remain
   clean, delegating all error decisions to the service layer.

5. Logging
   Each service function logs key operations and outcomes, including
   successful actions and potential security concerns such as unauthorized
   access attempts. This ensures full observability of business logic
   without duplicating logging across routers.

In summary, services define what the application actually does with data.
They are the single source of truth for business rules, keeping routers thin,
models clean, and logic centralized and easy to maintain.
"""