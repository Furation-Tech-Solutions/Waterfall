// Import necessary modules and classes
import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

// Define the structure of the input for feedback
interface FeedBackInput {
  fromRealtor: number;
  toRealtor: number;
  jobId: number;
  rating: number;
  description: string;
}

// Define a validator function for feedback input
const feedBackValidator = (
  input: FeedBackInput,
  isUpdate: boolean = false
) => {
  // Define a schema for feedback input using Joi
  const feedBackSchema = Joi.object<FeedBackInput>({
    fromRealtor: isUpdate
      ? Joi.number().optional()
      : Joi.number().required(),
    toRealtor: isUpdate
      ? Joi.number().optional()
      : Joi.number().required(),
    jobId: isUpdate
      ? Joi.number().optional()
      : Joi.number().required(),
    rating: isUpdate
      ? Joi.number().min(1).max(5).optional()
      : Joi.number().min(1).max(5).required(),
    description: isUpdate
      ? Joi.string().optional().trim()
      : Joi.string().required().trim()
  });

  // Validate the input against the schema
  const { error, value } = feedBackSchema.validate(input, {
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

// Define a middleware for validating feedback input
export const validateFeedBackInputMiddleware = (
  isUpdate: boolean = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client's feedback input using the feedBackValidator
      const validatedInput: FeedBackInput = feedBackValidator(
        body,
        isUpdate
      );

      // Continue to the next middleware or route handler
      next();
    } catch (error: any) {
      // Handle errors, e.g., respond with a custom error message
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
};
