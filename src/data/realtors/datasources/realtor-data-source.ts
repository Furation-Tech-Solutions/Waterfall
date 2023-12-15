// Import necessary modules and dependencies
import { RealtorEntity, RealtorModel } from "@domain/realtors/entities/realtors";
import Realtor from "../model/realtor-model";
import ApiError from "@presentation/error-handling/api-error";
import { Sequelize, Op ,DataTypes} from "sequelize";

// Define the interface for the RealtorDataSource
export interface RealtorDataSource {
  create(realtor: any): Promise<RealtorEntity>; // Return type should be Promise of RealtorEntity
  getAllRealtors(query: RealtorQuery): Promise<RealtorEntity[]>; // Return type should be Promise of an array of RealtorEntity
  read(id: string): Promise<RealtorEntity>; // Return type should be Promise of RealtorEntity or null
  update(id: string, realtor: any): Promise<RealtorEntity>; // Return type should be Promise of RealtorEntity
  delete(id: string): Promise<void>;
  realtorLogin(email: string, firebaseDeviceToken: string):Promise<any| null>;

}

export interface RealtorQuery {
  location?: string;
  gender?: string;
  q?: string;
  page: number;
  limit: number;
}

// Realtor Data Source communicates with the database
export class RealtorDataSourceImpl implements RealtorDataSource {
  constructor(private db: Sequelize) { }

  // Create a new Realtor entry
  async create(realtor: any): Promise<RealtorEntity> {
    // Check if a Realtor with the same email already exists
    const existingRealtors = await Realtor.findOne({
      where: {
        email: realtor.email,
      },
    });

    if (existingRealtors) {
      throw ApiError.realtorExist();
    }

    // Create a new Realtor record in the database
    const createdRealtor = await Realtor.create(realtor);

    // Create a default badge for the new Realtor
    const defaultBadge = { badgeName: "Member", timestamp: new Date() };

    // Update the Realtor's badge field with the default badge
    await createdRealtor.update({ badge: [defaultBadge] });

    return createdRealtor.toJSON(); // Return the newly created Realtor as a plain JavaScript object
  } 

  async getAllRealtors(query: RealtorQuery): Promise<RealtorEntity[]> {
    const currentPage = query.page || 1; // Default to page 1
    const itemsPerPage = query.limit || 10; // Default to 10 items per page
    const offset = (currentPage - 1) * itemsPerPage;
    //------------------------------------------------------------------------------------------------------------------------------------------------------------
    // Check for different query parameters and filter data accordingly
    if (query.location != undefined) {
      const data = await Realtor.findAll({
        where: {
          location: {
            [Op.iLike]: `%${query.location}%`,
          },
          deletedStatus: false,
        },
        limit: itemsPerPage, // Limit the number of results per page
        offset: offset, // Calculate the offset based on the current page
      });
      return data.map((realtor: any) => realtor.toJSON());
    }
    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    else if (query.gender != undefined) {
      const data = await Realtor.findAll({
        where: {
          deletedStatus: false,
          [Op.or]: [
            {
              firstName: {
                [Op.iLike]: `%${query.q}%`,
              },
            },
            {
              lastName: {
                [Op.iLike]: `%${query.q}%`,
              },
            },
            {
              email: {
                [Op.iLike]: `%${query.q}%`,
              },
            },
          ],
          gender: {
            [Op.iLike]: `%${query.gender}%`,
          },
        },
        limit: itemsPerPage, // Limit the number of results per page
        offset: offset, // Calculate the offset based on the current page
      });
      return data.map((realtor: any) => realtor.toJSON());
    }
    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    else if (query.q != undefined) {
      const data = await Realtor.findAll({
        where: {
          deletedStatus: false,
          [Op.or]: [
            {
              firstName: {
                [Op.iLike]: `%${query.q}%`,
              },
            },
            {
              lastName: {
                [Op.iLike]: `%${query.q}%`,
              },
            },
            {
              email: {
                [Op.iLike]: `%${query.q}%`,
              },
            },
          ],
        },
        limit: itemsPerPage, // Limit the number of results per page
        offset: offset, // Calculate the offset based on the current page
      });
      return data.map((realtor: any) => realtor.toJSON());
    }
    //------------------------------------------------------------------------------------------------------------------------------------------------------------
    else {
      // Handle other cases when 'location' is not provided (e.g., return all records)
      const data = await Realtor.findAll({
        where: {
          deletedStatus: false,
        },
        limit: itemsPerPage, // Limit the number of results per page
        offset: offset, // Calculate the offset based on the current page
      });

      return data.map((realtor: any) => realtor.toJSON());
    }
  }

  // Retrieve a Realtor entry by its ID
  async read(id: string): Promise<RealtorEntity> {
    // Find a Realtor record in the database by its ID
    const realtor = await Realtor.findOne({
      where: { id, deletedStatus: false },
    });
    
    if (realtor === null) {
      throw ApiError.dataNotFound();
    }

    // If a matching entry is found, convert it to a plain JavaScript object before returning
    return realtor.toJSON();
  }

  // Update a Realtor entry by ID
  async update(id: string, updatedData: any): Promise<RealtorEntity> {
    // Find the record by ID
    const realtor = await Realtor.findOne({
      where: { id, deletedStatus: false },
    });

    // Update the record with the provided data if it exists
    if (realtor) {
      await realtor.update(updatedData);
    }
    // Fetch the updated record
    const updatedRealtor = await Realtor.findByPk(id);

    if (updatedRealtor == null) {
      throw ApiError.notFound();
    }
    return updatedRealtor.toJSON();
  }

  // Delete a Realtor entry by ID
  // async delete(id: string): Promise<void> {

  //     // Find the Realtor to be soft-deleted
  //     const realtor: any = await Realtor.findByPk(id);

  //     // Check if the Realtor exists
  //     if (!realtor) {
  //         throw new Error('Realtor not found');
  //     }
  //     const updatedRealtor = await realtor.update({
  //         firstName: `deleted-${realtor.firstName}`,
  //         lastName: `deleted-${realtor.lastName}`,
  //         email: `deleted-${realtor.email}`,
  //         contact: `deleted-${realtor.contact}`,
  //     });

  //     // Soft delete the Realtor (set deletedAt)
  //     await updatedRealtor.destroy();
  // }

  async delete(id: string): Promise<void> {
    // Find the Realtor to be soft-deleted
    const realtor: any = await Realtor.findOne({
      where: { id, deletedStatus: false },
    });

    // Check if the Realtor exists
    if (!realtor) {
      throw new Error("Realtor not found");
    }

    // Update the Realtor's data and save changes
    await realtor.update({
      firstName: `Not-available-${realtor.firstName}`,
      lastName: `Not-available-${realtor.lastName}`,
      email: `Not-available-${realtor.email}`,
      contact: `Not-available-${realtor.contact}`,
      recoId: `Not-available-${realtor.recoId}`,
      deletedStatus: true,
    });

    // Fetch the updated record
    const updatedRealtor = await Realtor.findByPk(id);
    // console.log(updatedRealtor?.toJSON());

    // Soft delete the Realtor (set deletedAt)

    // console.log('Realtor soft-deleted successfully');


  }

  async realtorLogin(reatorEmail:string, firebaseDeviceToken:string): Promise<any | null> {
    
      const realtorData:any = await Realtor.findOne({ where: { email:reatorEmail } });
      if (realtorData) {
           
        if (firebaseDeviceToken !== undefined && firebaseDeviceToken !== "") {
          const tokenExists = await Realtor.findOne({
            where: {
              id: realtorData.id,
              firebaseDeviceToken: {  [Op.contains]: [firebaseDeviceToken]},
            
            },
          });
  
          if (!tokenExists) {
            realtorData.firebaseDeviceToken = [...realtorData.firebaseDeviceToken, firebaseDeviceToken];
            try {
              await realtorData.save(); // Attempt to save the updated document with the new token
            } catch (tokenSaveError) {
              // Handle token save error (optional)
              console.error("Error saving Firebase token:", tokenSaveError);
            }
          }
        }
        return realtorData.toJSON();
      }
  
      return null;
    
  }
}
