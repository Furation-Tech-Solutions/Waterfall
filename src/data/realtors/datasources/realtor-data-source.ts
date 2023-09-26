import { RealtorModel } from "@domain/realtors/entities/realtors";
import { Realtor } from "../model/realtor-model";
import mongoose from "mongoose";
import ApiError from "@presentation/error-handling/api-error";
export interface RealtorDataSource {
  create(realtor: RealtorModel): Promise<any>; // Return type should be Promise of RealtorEntity
}

export class RealtorDataSourceImpl implements RealtorDataSource {
  constructor(private db: mongoose.Connection) { }

  async create(realtor: RealtorModel): Promise<any> {

    const existingRealtor = await Realtor.findOne({ email: realtor.email });
    if (existingRealtor) {
      throw ApiError.emailExist()
    }

    const realtorData = new Realtor(realtor);

    const createdRealtor = await realtorData.save();

    return createdRealtor.toObject();
  }
}

