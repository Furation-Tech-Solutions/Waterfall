// Import necessary classes and dependencies
import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

// Define an interface to represent the expected input for report validation
interface ReportInput {
  fromRealtor: number;
  toRealtor: number;
  description: string;
  reportTimestamp?: Date; // Optional field, adjust as needed
}

// Define a function to validate the report input
const reportValidator = function (input: ReportInput): ReportInput {
  // Define a Joi schema to validate the input
  const reportSchema = Joi.object<ReportInput>({
    fromRealtor: Joi.number().required(),
    toRealtor: Joi.number().required(),
    description: Joi.string().required().min(1).max(1000).messages({
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

  // If validation errors exist, throw an ApiError
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

// Define a middleware function to validate report input in requests
export const validateReportInputMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the request body
    const { body } = req;

    // Validate the report input using the reportValidator
    const validatedInput: ReportInput = reportValidator(body);

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.status).json(error.message); // Respond with ApiError details
    }

    // Respond with a custom error in case of unexpected errors
    const err = ApiError.badRequest();
    return res.status(err.status).json(err.message);
  }
};

export default reportValidator; // Export the reportValidator function for external use
