// Import necessary modules and dependencies
import { FAQModel } from "@domain/faq/entities/faq";
import FAQ from "../model/faq-model";
import ApiError from "@presentation/error-handling/api-error";
import { Sequelize } from "sequelize";

// Define the interface for the FAQDataSource
export interface FAQDataSource {
  create(faq: FAQModel): Promise<any>; // Return type should be Promise of FAQEntity
  getAllFAQs(): Promise<any[]>; // Return type should be Promise of an array of FAQEntity
  read(id: string): Promise<any | null>; // Return type should be Promise of FAQEntity or null
  update(id: string, faq: FAQModel): Promise<any>; // Return type should be Promise of FAQEntity
  delete(id: string): Promise<void>;
}


// FAQ Data Source communicates with the database
export class FAQDataSourceImpl implements FAQDataSource {
  constructor(private db: Sequelize) {}

  // Create a new FAQ (Frequently Asked Question) entry
  async create(faq: any): Promise<any> {
    const existingFAQ = await FAQ.findOne({
      where: {
        question: faq.question,
      },
    });
    if (existingFAQ) {
      throw ApiError.questionExist();
    }
    const createdFAQ = await FAQ.create(faq);
    return createdFAQ.toJSON();
  }

  // Retrieve all FAQ entries
  async getAllFAQs(): Promise<any[]> {
    const faq = await FAQ.findAll({});
    return faq.map((faq: any) => faq.toJSON()); // Convert to plain JavaScript objects before returning
  }

  // Retrieve an FAQ entry by its ID
  async read(id: string): Promise<any | null> {
    const faq = await FAQ.findOne({
      where: {
        id: id,
      },
      // include: 'tags', // Replace 'tags' with the actual name of your association
    });
    return faq ? faq.toJSON() : null; // Convert to a plain JavaScript object before returning
  }

  // Update an FAQ entry by ID
  async update(id: string, updatedData: FAQModel): Promise<any> {
    // Find the record by ID
    const faq = await FAQ.findByPk(id);

    // Update the record with the provided data
    if (faq) {
      await faq.update(updatedData);
    }
    // Fetch the updated record
    const updatedFAQ = await FAQ.findByPk(id);

    return updatedFAQ ? updatedFAQ.toJSON() : null; // Convert to a plain JavaScript object before returning
  }

  // Delete an FAQ entry by ID
  async delete(id: string): Promise<void> {
    await FAQ.destroy({
      where: {
        id: id,
      },
    });
  }
}
