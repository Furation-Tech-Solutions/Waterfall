// Import necessary modules and classes
import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

// Define the structure of the input for FQA (Frequently Asked Questions)
interface FQAInput {
  question: string;
  answer: string;
}

// Define a validator function for FQA input
const fqaValidator = (
  input: FQAInput,
  isUpdate: boolean = false
) => {
  // Define a schema for FQA input using Joi
  const fqaSchema = Joi.object<FQAInput>({
    question: isUpdate
      ? Joi.string().optional().trim()
      : Joi.string().required().trim(),
    answer: isUpdate
      ? Joi.string().optional().trim()
      : Joi.string().required().trim()
  });

  // Validate the input against the schema
  const { error, value } = fqaSchema.validate(input, {
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

// Define a middleware for validating FQA input
export const validateFQAInputMiddleware = (
  isUpdate: boolean = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client's FQA input using the fqaValidator
      const validatedInput: FQAInput = fqaValidator(
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
