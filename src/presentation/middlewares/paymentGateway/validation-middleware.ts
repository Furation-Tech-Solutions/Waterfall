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
    jobId: isUpdate
    ? Joi.number().optional()
    : Joi.number().required(),
    jobApplicantId: isUpdate
    ?Joi.number().optional()
    :Joi.number().required(),
    amount: isUpdate
    ?Joi.string().optional()
    :Joi.string().required(),
    paymentMethod: isUpdate
    ?Joi.string()
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

// Export a middleware function to validate payment gateway input
export const validatePaymentGatewayInputMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the request body
    const { body } = req;

    // Validate the payment gateway input using the paymentGatewayValidator
    const validatedInput: PaymentGatewayInput = paymentGatewayValidator(body);

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

// Export the paymentGatewayValidator function
export default paymentGatewayValidator;
