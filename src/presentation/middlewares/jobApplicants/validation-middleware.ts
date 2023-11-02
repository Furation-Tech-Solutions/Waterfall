// Import necessary modules and types
import Joi, { ValidationErrorItem } from "joi"; // Import Joi for input validation and ValidationErrorItem for error details
import ApiError from "@presentation/error-handling/api-error"; // Import custom error class ApiError
import { Request, Response, NextFunction } from "express"; // Import Express types
import {
  applicationStatusEnum,
  jobStatusEnum,
} from "@data/jobApplicants/models/jobApplicants-models"; // Import enums for status and jobStatus

// Define the interface for the expected input data
interface JobApplicantInput {
  job: number;
  applicant: number;
  applicantStatus: string;
  agreement: boolean;
  jobStatus: string;
  appliedTimestamp: Date;
  paymentStatus: boolean;
}

// Define a function for validating job applicant input
const jobApplicantValidator = function (
  input: JobApplicantInput
): JobApplicantInput {
  // Define a Joi schema for validating the input
  const jobApplicantSchema = Joi.object<JobApplicantInput>({
    job: Joi.number().required(),
    applicant: Joi.number().required(),
    applicantStatus: Joi.string()
      .valid(...Object.values(applicationStatusEnum))
      .required()
      .messages({
        "any.only": "Invalid applicantStatus",
        "any.required": "applicantStatus is required",
      }),
    agreement: Joi.boolean().required().messages({
      "boolean.base": "Agreement must be a boolean",
      "any.required": "Agreement is required",
    }),
    jobStatus: Joi.string()
      .valid(...Object.values(jobStatusEnum))
      .required()
      .messages({
        "any.only": "Invalid job status",
        "any.required": "Job status is required",
      }),
    appliedTimestamp: Joi.date().required().messages({
      "date.base": "Applied timestamp must be a valid date",
      "any.required": "Applied timestamp is required",
    }),
    paymentStatus: Joi.boolean().required().messages({
      "boolean.base": "paymentStatus must be a boolean",
      "any.required": "paymentStatus is required",
    }),
  });

  // Validate the input against the schema
  const { error, value } = jobApplicantSchema.validate(input, {
    abortEarly: false,
  });

  // If there are validation errors, throw an ApiError
  if (error) {
    // Extract validation error messages
    const validationErrors: string[] = error.details.map(
      (err: ValidationErrorItem) => err.message
    );

    // Throw a custom ApiError with a bad request status
    throw new ApiError(
      ApiError.badRequest().status,
      validationErrors.join(", "),
      "ValidationError"
    );
  }

  // If validation passes, return the validated input
  return value;
};

// Export a middleware function to validate job applicant input
export const validateJobApplicantInputMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the request body
    const { body } = req;

    // Validate the job applicant input using the jobApplicantValidator
    const validatedInput: JobApplicantInput = jobApplicantValidator(body);

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Handle errors, including ApiError
    if (error instanceof ApiError) {
      return res.status(error.status).json(error.message);
    }

    // If it's not an ApiError, respond with a custom bad request error
    const err = ApiError.badRequest();
    return res.status(err.status).json(err.message);
  }
};

// Export the jobApplicantValidator function
export default jobApplicantValidator;
