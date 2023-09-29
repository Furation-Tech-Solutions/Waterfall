import { FAQSModel } from "@domain/faqs/entities/faqs";
import { FAQS } from "../model/faqs-model";
import mongoose from "mongoose";
import ApiError from "@presentation/error-handling/api-error";
export interface FAQSDataSource {
  create(faqs: FAQSModel): Promise<any>; // Return type should be Promise of FAQSEntity
  getAllFAQSs(): Promise<any[]>; // Return type should be Promise of an array of FAQSEntity
}

export class FAQSDataSourceImpl implements FAQSDataSource {
  constructor(private db: mongoose.Connection) { }

  async create(faqs: FAQSModel): Promise<any> {

    // const existingFAQS = await FAQS.findOne({ email: faqs.email });
    // if (existingFAQS) {
    //   throw ApiError.emailExist()
    // }

    const faqsData = new FAQS(faqs);

    const createdFAQS = await faqsData.save();

    return createdFAQS.toObject();
  }

  async getAllFAQSs(): Promise<any[]> {
    const faqss = await FAQS.find();
    return faqss.map((faqs) => faqs.toObject()); // Convert to plain JavaScript objects before returning
  }
}

