const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const CONFLICT = 409;
const INTERNAL_SERVER_ERROR = 500;

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}
class BadRequestError extends ApiError {
  constructor(message = "Bad Request") { super(BAD_REQUEST, message); this.name = "BadRequestError"; }
}
class UnauthorizedError extends ApiError {
  constructor(message = "Authorization required") { super(UNAUTHORIZED, message); this.name = "UnauthorizedError"; }
}
class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") { super(FORBIDDEN, message); this.name = "ForbiddenError"; }
}
class NotFoundError extends ApiError {
  constructor(message = "Not found") { super(NOT_FOUND, message); this.name = "NotFoundError"; }
}
class ConflictError extends ApiError {
  constructor(message = "Conflict") { super(CONFLICT, message); this.name = "ConflictError"; }
}
class AuthError extends ApiError {
  constructor(message = "Incorrect email or password") { super(UNAUTHORIZED, message); this.name = "AuthError"; }
}






module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  FORBIDDEN,
  CONFLICT,
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  AuthError,
};
