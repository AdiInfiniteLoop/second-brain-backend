import { Request, Response, NextFunction } from "express";
import { ErrorClass } from "../utils/errorClass";

type ErrorObj = {
  message: string;
  value?: string;
  errmsg?: string;
  errors?: Record<string, { message: string; path: string; value: string }>;
};

export function handleValidationError(err: any) {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  
  err.message = `Validation failed: ${errors.join(". ")}`;
  
  return new ErrorClass(err.message, 400);
}


export function handleCastErrorDB(err: ErrorObj) {
  err.message = `Invalid ID: ${err.value}`;
  return new ErrorClass(err.message, 400);
}

export function handleDuplicateKey(err: ErrorObj) {
  const value = err.errmsg?.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  if (value) {
    err.message = `Duplicate field value: ${value[0]} already exists in the database.`;
  }
  return new ErrorClass(err.message, 400);
}
export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const error: any = {
    ...err,
    message: err.message || "An error occurred",
  };

  if (err.name === "ValidationError") {
    error.message = handleValidationError(err).message;
    error.statusCode = 400;
  } else if (err.name === "CastError") {
    error.message = handleCastErrorDB(err).message;
    error.statusCode = 400;
  } else if (err.code === 11000) {
    error.message = handleDuplicateKey(err).message;
    error.statusCode = 400;
  } else if (!(err instanceof ErrorClass)) {
    error.message = "Something went wrong";
    error.statusCode = 500;
  }

  console.error("Error:", error);

  res.status(error.statusCode || 500).json({
    status: "Failed",
    message: error.message,
  });
}
