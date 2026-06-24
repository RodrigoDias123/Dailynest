"""
Core Application Infrastructure

This module contains the foundational configuration and infrastructure
components that the entire application depends on. Unlike models or schemas,
which define data structure, the core layer defines how the application
connects, configures, and operates at runtime.

Key responsibilities of the core layer:

1. Configuration Management (config.py)
   Loads and validates all environment variables using a Pydantic Settings
   class. Provides a single `settings` object consumed across the application
   for values such as database URL, secret key, algorithm, and token
   expiration. Ensures the app fails early and clearly if required variables
   are missing.

2. Database Connectivity (database.py)
   Creates the SQLAlchemy engine from the database URL defined in settings.
   Provides the `get_session` dependency used by all routers to obtain a
   scoped database session per request. Also responsible for creating all
   tables on startup via SQLModel metadata.

3. Exception Handling (exceptions.py)
   Defines custom application exceptions used to signal known error conditions
   such as resource not found, unauthorized access, or duplicate entries.
   Keeping exceptions centralized avoids scattered HTTP error logic across
   services and routers, and makes error behavior consistent and predictable.

4. Logging (logging.py)
   Configures a shared logger instance used across the entire application.
   Ensures consistent log formatting, levels, and output destinations.
   All services and routers import from here rather than configuring their
   own loggers, keeping observability uniform and easy to manage.

In summary, the core layer is the backbone of the application — it does not
handle business logic or API contracts, but ensures that every other layer
has a stable, consistent foundation to operate on.
"""