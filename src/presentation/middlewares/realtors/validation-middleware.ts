import Joi, { Schema } from "joi";
import { RealtorModel } from "@domain/realtors/entities/realtors";
import { Request, Response, NextFunction } from 'express';

// Define a custom type that extends the Express Request type
interface CustomRequest extends Request {
    validatedRealtorData?: RealtorModel; // Assuming RealtorModel is the type for the validated realtor data
  }

const realtorSchema: Schema<RealtorModel> = Joi.object({
  firstName: Joi.string().required().max(53).trim().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
    "string.max": "Name should be under 53 characters",
    "any.required": "Name is required",
  }),
  lastName: Joi.string().required().max(53).trim().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
    "string.max": "Name should be under 53 characters",
    "any.required": "Name is required",
  }),
  address: Joi.object({
    streetName: Joi.string().required(),
    landMark: Joi.string().required(),
    city: Joi.string().required(),
    pinCode: Joi.number().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
  email: Joi.string().email().required().trim().lowercase().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().min(5),
  phone: Joi.number().required().max(9999999999999).messages({
    "number.base": "Phone number must be a number",
    "number.empty": "Phone number is required",
    "number.integer": "Phone number must be an integer",
    "number.max": "Phone number should be under 13 digits",
    "any.required": "Phone number is required",
  }),
  aadharCard: Joi.number().required(),
  yearsOfExperience: Joi.number(),
  specialization: Joi.string().max(50),
  deleteStatus: Joi.boolean().default(true)
  });
  
function validateRealtorMiddleware(req: CustomRequest, res: Response, next: NextFunction) {
  const realtorData: RealtorModel = req.body; // Assuming the realtor data is sent in the request body

  const { error, value } = realtorSchema.validate(realtorData);

  if (error) {
    // Return a 400 Bad Request response with validation error details
    return res.status(400).json({ error: error.message });
  }

  // If validation succeeds, attach the validated realtor data to the request object for further processing in the route handler
  req.validatedRealtorData = value;
  next();
}

export default validateRealtorMiddleware;

