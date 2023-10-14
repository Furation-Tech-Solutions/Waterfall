import Joi, { ValidationErrorItem } from "joi"; // Import Joi for input validation
import ApiError from "@presentation/error-handling/api-error"; // Import ApiError for custom error handling
import { Request, Response, NextFunction } from "express"; // Import Request, Response, and NextFunction from Express

// Define the structure of BugReportInput
interface BugReportInput {
  realtor: number;
  description: string;
  attachments: string;
  timestamp?: Date; // Optional field, adjust as needed
}

// Define a function for validating BugReportInput
const bugReportValidator = function (input: BugReportInput): BugReportInput {
  // Define a Joi schema for BugReportInput
  const bugReportSchema = Joi.object<BugReportInput>({
    realtor: Joi.number().required(),
    description: Joi.string().required().max(1000).messages({
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

  // If there are validation errors, throw an ApiError
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

  // Return the validated input
  return value;
};

// Define a middleware for validating BugReportInput
export const validateBugReportInputMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the request body
    const { body } = req;

    // Validate the report input using the bugReportValidator
    const validatedInput: BugReportInput = bugReportValidator(body);

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.status).json(error.message);
    }

    // Respond with a custom error if not an ApiError
    const err = ApiError.badRequest();
    return res.status(err.status).json(err.message);
  }
};

export default bugReportValidator; // Export the bugReportValidator for reuse
