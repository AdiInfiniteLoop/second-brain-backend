import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import {ErrorClass} from "../utils/errorClass";


// Handle CastError for invalid ObjectId
const handleCastErrorDB = (err: any): ErrorClass => {
  const message = `Invalid ID: ${err.value}. Please provide a valid ObjectId.`;
  return new ErrorClass(message, 400);
};

// Handle Duplicate Key Error (MongoDB)
const handleDuplicateKey = (err: any): ErrorClass => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  const message = `Duplicate field value: ${value[0]} already exists in the database.`;
  return new ErrorClass(message, 400);
};

// Handle JWT Error (invalid token)
const handleJWTError = (): ErrorClass => {
  return new ErrorClass('Invalid Token. Please log in again.', 401);
};

// Handle Token Expired Error (expired JWT)
const handleTokenExpiredError = (): ErrorClass => {
  return new ErrorClass('Token has expired. Please log in again.', 401);
};

const handleValidationError = (): ErrorClass => {
  return new ErrorClass('Validation error', 401)
}

// Error handler middleware (with correct typings)
export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => { // Ensure the return type is void
  console.error("ddd" , err.name); // Log error for debugging

  // Default error properties
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle specific errors based on name or code
  if (err.name === 'CastError') {
    err = handleCastErrorDB(err);
  }
  if (err.code === 11000) {
    err = handleDuplicateKey(err);
  }
  if (err.name === 'JsonWebTokenError') {
    err = handleJWTError();
  }
  if (err.name === 'TokenExpiredError') {
    err = handleTokenExpiredError();
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    // const errors = Object.values(err.errors).map((el: any) => el.message);
    // res.status(400).json({
    //   status: 'fail',
    //   message: 'Validation error',
    //   errors, // List of validation error messages
    // });
    err = handleValidationError()
  }

  // Return general error response (no return type)
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
  next()
};
