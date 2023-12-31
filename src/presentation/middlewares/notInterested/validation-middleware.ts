import Joi, { ValidationErrorItem } from "joi"; // Importing Joi for input validation
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

// Define an interface for the expected NotInterestedInput structure
interface NotInterestedInput {
  realtorId: string;
  jobId: number;
}

// Define a validator function for NotInterestedInput
const notInterestedValidator = (
  input: NotInterestedInput,
  isUpdate: boolean = false
) => {
  // Define a Joi schema for validation
  const notInterestedSchema = Joi.object<NotInterestedInput>({
    realtorId: isUpdate
      ? Joi.string().optional().messages({
        "string.base": "realtorId must be a string",
        "string.empty": "realtorId is required",
        "any.required": "realtorId is required",
      })
      : Joi.string().required().messages({
        "string.base": "realtorId must be a string",
        "string.empty": "realtorId is required",
        "any.required": "realtorId is required",
      }),
    jobId: isUpdate
      ? Joi.number().optional().messages({
        "string.base": "jobId must be a number",
        "string.empty": "jobId is required",
        "any.required": "jobId is required",
      })
      : Joi.number().required().messages({
        "string.base": "jobId must be a number",
        "string.empty": "jobId is required",
        "any.required": "jobId is required",
      }),
  });

  // Validate the input against the schema
  const { error, value } = notInterestedSchema.validate(input, {
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

// Define a middleware for validating notInterested input
export const validateNotInterestedInputMiddleware = (isUpdate: boolean = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client's notInterested input using the notInterestedValidator
      const validatedInput: NotInterestedInput = notInterestedValidator(body, isUpdate);

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
};
