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
  jobId: number;
  applicantId: string;
  applicantStatus: string;
  applicantStatusUpdateTime: string;
  agreement: boolean;
  jobStatus: string;
  paymentStatus: boolean;
  paymentStatusUpdateTime: string;
}

// Define a function for validating job applicant input
const jobApplicantValidator = (
  input: JobApplicantInput,
  isUpdate: boolean = false
) => {
  // Define a Joi schema for validating the input
  const jobApplicantSchema = Joi.object<JobApplicantInput>({
    jobId: isUpdate ? Joi.number().optional() : Joi.number().required(),
    applicantId: isUpdate ? Joi.string().optional() : Joi.string().required(),
    applicantStatus: isUpdate
      ? Joi.string()
          .valid(...Object.values(applicationStatusEnum))
          .optional()
          .messages({
            "any.only": "Invalid applicantStatus",
            "any.required": "applicantStatus is required",
          })
      : Joi.string()
          .valid(...Object.values(applicationStatusEnum))
          .optional()
          .messages({
            "any.only": "Invalid applicantStatus",
            "any.required": "applicantStatus is required",
          }),
    applicantStatusUpdateTime: Joi.string().optional().messages({
      "string.base": "Data must be a string",
    }),
    agreement: isUpdate
      ? Joi.boolean().optional().messages({
          "boolean.base": "Agreement must be a boolean",
          "any.required": "Agreement is required",
        })
      : Joi.boolean().optional().messages({
          "boolean.base": "Agreement must be a boolean",
          "any.required": "Agreement is required",
        }),
    jobStatus: isUpdate
      ? Joi.string()
          .valid(...Object.values(jobStatusEnum))
          .optional()
          .messages({
            "any.only": "Invalid job status",
            "any.required": "Job status is required",
          })
      : Joi.string()
          .valid(...Object.values(jobStatusEnum))
          .optional()
          .messages({
            "any.only": "Invalid job status",
            "any.required": "Job status is required",
          }),
    paymentStatus: isUpdate
      ? Joi.boolean().optional().messages({
          "boolean.base": "paymentStatus must be a boolean",
          "any.required": "paymentStatus is required",
        })
      : Joi.boolean().optional().messages({
          "boolean.base": "paymentStatus must be a boolean",
          "any.required": "paymentStatus is required",
        }),
    paymentStatusUpdateTime: Joi.string().optional().messages({
      "string.base": "Data must be a string",
    }),
  });

  // Validate the input against the schema
  const { error, value } = jobApplicantSchema.validate(input, {
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

// Define a middleware for validating jobApplicant input
export const validateJobApplicantInputMiddleware = (isUpdate: boolean = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client's jobApplicant input using the jobApplicantValidator
      const validatedInput: JobApplicantInput = jobApplicantValidator(body, isUpdate);

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