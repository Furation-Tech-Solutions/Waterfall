import Joi, { ValidationErrorItem } from "joi"; // Import Joi for input validation
import ApiError from "@presentation/error-handling/api-error"; // Import ApiError for custom error handling
import { Request, Response, NextFunction } from "express"; // Import Request, Response, and NextFunction from Express

// Define the structure of BugReportInput
interface BugReportInput {
  realtorId: string;
  description: string;
  attachments: string;
  timestamp?: Date; // Optional field, adjust as needed
}

// Define a function for validating BugReportInput
const bugReportValidator = (
  input: BugReportInput,
  isUpdate: boolean = false
) => {
  // Define a Joi schema for BugReportInput
  const bugReportSchema = Joi.object<BugReportInput>({
    realtorId: isUpdate ? Joi.string().optional() : Joi.string().required(),
    description: isUpdate
      ? Joi.string().optional().max(1000).messages({
          "string.base": "Description must be a string",
          "string.empty": "Description is required",
          "string.max": "Description should be at most 1000 characters",
          "any.required": "Description is required",
        })
      : Joi.string().required().max(1000).messages({
          "string.base": "Description must be a string",
          "string.empty": "Description is required",
          "string.max": "Description should be at most 1000 characters",
          "any.required": "Description is required",
        }),
    attachments: Joi.array().items(Joi.string().uri()).allow(null).messages({
      "array.base": "Attachments must be an array of strings",
      "array.items": "Attachments must be valid URIs",
    }),
    timestamp: Joi.date().default(new Date()).messages({
      "date.base": "Report timestamp must be a valid date",
    }),
  });

  // Validate the input against the schema
  const { error, value } = bugReportSchema.validate(input, {
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

// Define a middleware for validating bugReport input
export const validateBugReportInputMiddleware = (isUpdate: boolean = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client's bugReport input using the bugReportValidator
      const validatedInput: BugReportInput = bugReportValidator(body, isUpdate);

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