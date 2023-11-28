import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";
import { DataTypes } from "sequelize";
import Realtors from "@data/realtors/model/realtor-model";

// Define the structure of the expected input data for the Message model
interface MessageInput {
  sender: number;
  receiver: number;
  message: string;
}

// Create a function for validating the Message input
const messageValidator = async (input: MessageInput, isUpdate: boolean = false) => {
  // Define a schema for validating the input using Joi
  const messageSchema = Joi.object<MessageInput>({
    // Validate sender
    sender: isUpdate ? Joi.number().optional() : Joi.number().required(),

    // Validate receiver
    receiver: isUpdate ? Joi.number().optional() : Joi.number().required(),

    // Validate message
    message: Joi.string().allow("").required().messages({
      "string.required": "message is required",
    }),
  });

  // Validate the input against the schema
  const { error, value } = messageSchema.validate(input, {
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

  // Check if sender and receiver IDs exist in the Realtors model
  if (!isUpdate) {
    const { sender, receiver } = value;

    // Check if sender ID exists in Realtors
    const senderExists = await Realtors.findByPk(sender);
    if (!senderExists) {
      throw new ApiError(
        ApiError.badRequest().status,
        "Sender ID does not exist in Realtors",
        "ValidationError"
      );
    }

    // Check if receiver ID exists in Realtors
    const receiverExists = await Realtors.findByPk(receiver);
    if (!receiverExists) {
      throw new ApiError(
        ApiError.badRequest().status,
        "Receiver ID does not exist in Realtors",
        "ValidationError"
      );
    }
  }

  return value; // Return the validated input
};

// Define a middleware for validating Message input
export const validateMessageInputMiddleware = (isUpdate: boolean = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the Message input using the messageValidator
      const validatedInput: MessageInput = await messageValidator(body, isUpdate);

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