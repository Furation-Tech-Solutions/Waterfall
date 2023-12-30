// Import necessary classes and dependencies
import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

// Define an interface to represent the expected input for report validation
interface ReportInput {
  fromRealtorId: string;
  toRealtorId: string;
  description: string;
  reportTimestamp?: Date; // Optional field, adjust as needed
}

// Define a function to validate the report input
const reportValidator = (input: ReportInput, isUpdate: boolean = false) => {
  // Define a Joi schema to validate the input
  const reportSchema = Joi.object<ReportInput>({
    fromRealtorId: isUpdate
      ? Joi.string().optional().messages({
          "string.base": "fromRealtor must be string",
          "string.empty": "fromRealtor is required",
        })
      : Joi.string().required().messages({
          "string.base": "fromRealtor must be string",
          "string.empty": "fromRealtor is required",
          "any.required": "fromRealtor is required",
        }),
    toRealtorId: isUpdate
      ? Joi.string().optional().messages({
          "string.base": "toRealtor must be string",
          "string.empty": "toRealtor is required",
        })
      : Joi.string().required().messages({
          "string.base": "toRealtor must be string",
          "string.empty": "toRealtor is required",
          "any.required": "toRealtor is required",
        }),
    description: isUpdate
      ? Joi.string().optional().min(1).max(1000).messages({
          "string.base": "Description must be a string",
          "string.empty": "Description is required",
          "string.min": "Description should be at least 1 character",
          "string.max": "Description should be under 1000 characters",
          "any.required": "Description is required",
        })
      : Joi.string().required().min(1).max(1000).messages({
          "string.base": "Description must be a string",
          "string.empty": "Description is required",
          "string.min": "Description should be at least 1 character",
          "string.max": "Description should be under 1000 characters",
          "any.required": "Description is required",
        }),
    reportTimestamp: Joi.date().messages({
      "date.base": "Report Timestamp must be a valid date",
    }),
  });

  // Validate the input against the schema
  const { error, value } = reportSchema.validate(input, {
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

// Define a middleware for validating report input
export const validateReportInputMiddleware = (isUpdate: boolean = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client's report input using the reportValidator
      const validatedInput: ReportInput = reportValidator(body, isUpdate);

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