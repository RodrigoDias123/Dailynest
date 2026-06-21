class ServiceError(Exception):
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)

class NotFoundError(ServiceError):
    pass

class ValidationError(ServiceError):
    pass