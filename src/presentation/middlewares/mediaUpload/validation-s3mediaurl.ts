import ApiError from "@presentation/error-handling/api-error";
import { NextFunction, Request, Response } from "express";
import Joi, { ValidationErrorItem } from "joi";

// Define a function for validating PresignedUrlInput
const presignedUrlValidator = (input: { prevUrl: string }) => {
    // Define a Joi schema for PresignedUrlInput
    const presignedUrlSchema = Joi.object({
      prevUrl: Joi.string().uri().required().messages({
        "string.base": "Previous URL must be a string",
        "string.empty": "Previous URL is required",
        "string.uri": "Previous URL must be a valid URI",
        "any.required": "Previous URL is required",
      }),
    });
  
    // Validate the input against the schema
    const { error, value } = presignedUrlSchema.validate(input, {
      abortEarly: false,
    });
  
    // If validation fails, throw a custom ApiError
    if (error) {
      const validationErrors: string[] = error.details.map(
        (err: ValidationErrorItem) => err.message
      );
      throw new ApiError(
        ApiError.badRequest().status,
        validationErrors.join(", "),
        "ValidationError"
      );
    }
  
    return value; // Return the validated input
  };
  
  // Define a middleware for validating PresignedUrlInput
  export const validatePresignedUrlMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Extract the request body
      const { body } = req;
  
      // Validate the client's PresignedUrl input using the presignedUrlValidator
      const validatedInput = presignedUrlValidator(body);
  
      // Continue to the next middleware or route handler
      next();
    } catch (error: any) {
      // Handle errors, e.g., respond with a custom error message
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
  