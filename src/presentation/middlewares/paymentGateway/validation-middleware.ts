// Import necessary modules and types
import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";
import {
  paymentMethodEnum
} from "@data/paymentGateway/models/paymentGateway-models";
// Define the interface for the expected input data
interface PaymentGatewayInput {
  jobId: number;
  jobApplicantId: number;
  amount: string;
  paymentMethod: string;
}

// Define a function for validating payment gateway input
const paymentGatewayValidator = (
  input: PaymentGatewayInput,
  isUpdate: boolean = false
) => {
  // Define a Joi schema for validating the input
  const paymentGatewaySchema = Joi.object<PaymentGatewayInput>({
    jobId: isUpdate ? Joi.number().optional() : Joi.number().required(),
    jobApplicantId: isUpdate
      ? Joi.number().optional()
      : Joi.number().required(),
    amount: isUpdate ? Joi.string().optional() : Joi.string().required(),
    paymentMethod: isUpdate
      ? Joi.string()
          .valid(...Object.values(paymentMethodEnum))
          .optional()
          .messages({
            "any.only": "Invalid payment method",
            "any.required": "Payment method is required",
          })
      : Joi.string()
          .valid(...Object.values(paymentMethodEnum))
          .required()
          .messages({
            "any.only": "Invalid payment method",
            "any.required": "Payment method is required",
          }),
  });

  // Validate the input against the schema
  const { error, value } = paymentGatewaySchema.validate(input, {
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

// Define a middleware for validating paymentGateway input
export const validatePaymentGatewayInputMiddleware = (isUpdate: boolean = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client's paymentGateway input using the paymentGatewayValidator
      const validatedInput: PaymentGatewayInput = paymentGatewayValidator(body, isUpdate);

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