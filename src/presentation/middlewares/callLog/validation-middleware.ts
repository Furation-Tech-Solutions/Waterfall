// Import necessary modules and dependencies
import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";
import { OutcomeEnum } from "@data/callLog/models/callLog-model"; // Adjust the import path accordingly

// Define an interface for the expected input data
interface CallLogInput {
  jobApplicant: number;
  logActivity: string;
  logOutcome: string;
}

// Define a function for validating call log input data
const callLogValidator = function (input: CallLogInput): CallLogInput {
  // Define a schema using Joi for validating the input
  const callLogSchema = Joi.object<CallLogInput>({
    jobApplicant: Joi.number().required(),
    logActivity: Joi.string().required().min(1).max(500).messages({
      "string.base": "Log activity must be a string",
      "string.empty": "Log activity is required",
      "string.min": "Log activity should be at least 1 character",
      "string.max": "Log activity should be under 500 characters",
      "any.required": "Log activity is required",
    }),
    logOutcome: Joi.string()
      .valid(...Object.values(OutcomeEnum))
      .required()
      .messages({
        "any.only": "Invalid log outcome",
        "any.required": "Log outcome is required",
      }),
  });

  // Validate the input against the schema
  const { error, value } = callLogSchema.validate(input, {
    abortEarly: false, // Collect all validation errors
  });

  // If there are validation errors, create an ApiError and throw it
  if (error) {
    const validationErrors: string[] = error.details.map(
      (err: ValidationErrorItem) => err.message
    );

    throw new ApiError(
      ApiError.badRequest().status,
      validationErrors.join(", "), // Combine validation error messages
      "ValidationError"
    );
  }

  // Return the validated input data
  return value;
};

// Define a middleware for validating call log input
export const validateCallLogInputMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the request body
    const { body } = req;

    // Validate the call log input using the callLogValidator
    const validatedInput: CallLogInput = callLogValidator(body);

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      // If the error is an instance of ApiError, send a custom error response
      return res.status(error.status).json(error.message);
    }

    // If the error is not an instance of ApiError, send a generic bad request error
    const err = ApiError.badRequest();
    return res.status(err.status).json(err.message);
  }
};

// Export the callLogValidator function as the default export
export default callLogValidator;
