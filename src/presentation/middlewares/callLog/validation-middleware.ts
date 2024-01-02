// Import necessary modules and dependencies
import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";
import { OutcomeEnum } from "@data/callLog/models/callLog-model"; // Adjust the import path accordingly

// Define an interface for the expected input data
interface CallLogInput {
  jobApplicantId: number;
  jobId: number;
  logActivity: string;
  logOutcome: string;
}

// Define a function for validating call log input data
const callLogValidator = (input: CallLogInput, isUpdate: boolean = false) => {
  // Define a schema using Joi for validating the input
  const callLogSchema = Joi.object<CallLogInput>({
    jobApplicantId: isUpdate
      ? Joi.number().optional()
      : Joi.number().required(),
    jobId: isUpdate
      ? Joi.number().optional()
      : Joi.number().required(),
    logActivity: isUpdate
      ? Joi.string().optional().min(1).max(500).messages({
          "string.base": "Log activity must be a string",
          "string.empty": "Log activity is required",
          "string.min": "Log activity should be at least 1 character",
          "string.max": "Log activity should be under 500 characters",
          "any.required": "Log activity is required",
        })
      : Joi.string().required().min(1).max(500).messages({
          "string.base": "Log activity must be a string",
          "string.empty": "Log activity is required",
          "string.min": "Log activity should be at least 1 character",
          "string.max": "Log activity should be under 500 characters",
          "any.required": "Log activity is required",
        }),
    logOutcome: isUpdate
      ? Joi.string()
          .valid(...Object.values(OutcomeEnum))
          .optional()
          .messages({
            "any.only": "Invalid log outcome",
            "any.required": "Log outcome is required",
          })
      : Joi.string()
          .valid(...Object.values(OutcomeEnum))
          .required()
          .messages({
            "any.only": "Invalid log outcome",
            "any.required": "Log outcome is required",
          }),
  });

  // Validate the input against the schema
  const { error, value } = callLogSchema.validate(input, {
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
export const validateCallLogInputMiddleware = (isUpdate: boolean = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client's feedback input using the callLogValidator
      const validatedInput: CallLogInput = callLogValidator(body, isUpdate);

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
