// Import necessary modules and classes
import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

// Define the structure of the input for FAQ (Frequently Asked Questions)
interface FAQInput {
  question: string;
  answer: string;
}

// Define a validator function for FAQ input
const faqValidator = (
  input: FAQInput,
  isUpdate: boolean = false
) => {
  // Define a schema for FAQ input using Joi
  const faqSchema = Joi.object<FAQInput>({
    question: isUpdate
      ? Joi.string().optional().trim()
      : Joi.string().required().trim(),
    answer: isUpdate
      ? Joi.string().optional().trim()
      : Joi.string().required().trim()
  });

  // Validate the input against the schema
  const { error, value } = faqSchema.validate(input, {
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

// Define a middleware for validating FAQ input
export const validateFAQInputMiddleware = (
  isUpdate: boolean = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client's FAQ input using the faqValidator
      const validatedInput: FAQInput = faqValidator(
        body,
        isUpdate
      );

      // Continue to the next middleware or route handler
      next();
    } catch (error: any) {
      // Handle errors, e.g., respond with a custom error message
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
};
