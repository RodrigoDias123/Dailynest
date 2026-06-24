"""
API Routers (Route Handlers)

This module contains the FastAPI routers that define the HTTP endpoints
exposed by the application. Routers act as the entry point for all incoming
requests, bridging the gap between the HTTP layer and the business logic
layer.

Key responsibilities of routers:

1. Endpoint Definitions
   Each router groups related endpoints under a common prefix and tag.
   HTTP methods (GET, POST, PATCH, DELETE) map to specific operations,
   following REST conventions for resource management.

2. Dependency Injection
   Routers rely on FastAPI's dependency system to obtain:
   - A scoped database session per request via `get_session`
   - The authenticated user via `get_current_user`
   This keeps route functions clean and focused solely on handling requests.

3. Request & Response Contracts
   Routers use Pydantic schemas to validate incoming request bodies and
   shape outgoing responses. This ensures the API surface is predictable,
   documented, and decoupled from the internal database models.

4. Delegation to Services
   Routers do not contain business logic. All meaningful operations —
   such as creating, updating, or deleting resources — are delegated to
   the service layer. This keeps route functions thin and focused on
   HTTP concerns only.

5. Logging & Error Propagation
   Each route logs the incoming request with relevant context such as
   user ID and resource ID. Unexpected exceptions are logged and re-raised,
   allowing global exception handlers to return consistent error responses.

In summary, routers define what the API can do and how it is accessed,
while delegating what actually happens to the service layer beneath them.
"""