import Joi, { Schema } from "joi";
import { FAQSModel } from "@domain/faqs/entities/faqs";
import { Request, Response, NextFunction } from 'express';

// Define a custom type that extends the Express Request type
interface CustomRequest extends Request {
    validatedFAQSData?: FAQSModel; // Assuming FAQSModel is the type for the validated faqs data
  }

const faqsSchema: Schema<FAQSModel> = Joi.object({
  question: Joi.string()
    .required()
    .trim(),
  answer: Joi.string()
    .required()
    .trim(),
  createdDate: Joi.date().default(Date.now),
  deleteStatus: Joi.boolean().default(true)
  });
  
function validateFAQSMiddleware(req: CustomRequest, res: Response, next: NextFunction) {
  const faqsData: FAQSModel = req.body; // Assuming the faqs data is sent in the request body

  const { error, value } = faqsSchema.validate(faqsData);

  if (error) {
    // Return a 400 Bad Request response with validation error details
    return res.status(400).json({ error: error.message });
  }

  // If validation succeeds, attach the validated faqs data to the request object for further processing in the route handler
  req.validatedFAQSData = value;
  next();
}

export default validateFAQSMiddleware;

