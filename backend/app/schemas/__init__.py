"""
Schemas (Pydantic/SQLModel models for API input/output)

This module defines the data structures used by the API to validate and shape
incoming requests and outgoing responses. Schemas are NOT database tables and
do not contain persistence logic. Instead, they serve three main purposes:

1. Input Validation (Requests)
   Schemas ensure that data sent by the client is well‑formed, typed correctly,
   and contains all required fields. Examples include:
   - Create schemas (data required to create a resource)
   - Update schemas (optional fields for partial updates)

2. Output Serialization (Responses)
   Schemas define what the API returns to the client. They hide sensitive or
   internal fields (e.g., passwords, foreign key relationships) and expose only
   safe, public information.

3. Separation of Concerns
   Schemas keep API logic independent from database models. This prevents
   leaking internal database structure to the outside world and keeps the
   application modular, secure, and easier to maintain.

Each resource typically includes:
- Base schema: shared fields
- Create schema: required fields for creation
- Update schema: optional fields for modification
- Public schema: safe representation returned by the API

Schemas are central to FastAPI’s validation system and ensure clean, predictable,
and secure communication between the client and the server.
"""
