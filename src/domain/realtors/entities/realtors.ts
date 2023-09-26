// Express API request populate the Realtor Model
export class RealtorModel {
    constructor(
      public firstName: string = "",
      public lastName: string = "",
      public address: addressModel,
      public email: string = "",
      public password: string = "",
      public phone: number = 0,
      public aadharCard: number = 0,
      public yearsOfExperience: number = 0,
      public specialization: string = "",
      public deleteStatus: boolean
    ) {}
  }
  export class addressModel {
    constructor(
      public streetName: string = "",
      public landMark: string = "",
      public city: string = "",
      public pinCode: number = 0,
      public state: string = "",
      public country: string = "",
    ) {}
  }
  
  // Realtor Entity provided by Realtor Repository is converted to Express API Response
  export class RealtorEntity {
    constructor(
      public id: string | undefined = undefined, // Set a default value for id
      public firstName: string,
      public lastName: string,
      public address: addressEntity,
      public email: string,
      public password: string,
      public phone: number,
      public aadharCard: number,
      public yearsOfExperience: number,
      public specialization: string,
      public deleteStatus: boolean
    ) {}
  }
  export class addressEntity {
    constructor(
      public streetName: string,
      public landMark: string,
      public city: string,
      public pinCode: number,
      public state: string,
      public country: string,
    ) {}
  }
  
  export class RealtorMapper {
    static toEntity(
      realtorData: any,
      includeId?: boolean,
      existingRealtor?: RealtorEntity
    ): RealtorEntity {
      if (existingRealtor != null) {
        // If existingRealtor is provided, merge the data from realtorData with the existingRealtor
        return {
          ...existingRealtor,
          firstName:
            realtorData.firstName !== undefined 
            ? realtorData.firstName 
            : existingRealtor.firstName,
          lastName:
            realtorData.lastName !== undefined 
            ? realtorData.lastName 
            : existingRealtor.lastName,
          address:
            realtorData.address !== undefined 
            ? realtorData.address 
            : existingRealtor.address,
          email:
            realtorData.email !== undefined 
            ? realtorData.email 
            : existingRealtor.email,
          password:
            realtorData.password !== undefined
              ? realtorData.password
              : existingRealtor.password,
          phone:
            realtorData.phone !== undefined
              ? realtorData.phone
              : existingRealtor.phone,
          aadharCard:
            realtorData.aadharCard !== undefined 
            ? realtorData.aadharCard 
            : existingRealtor.aadharCard,
          yearsOfExperience:
            realtorData.yearsOfExperience !== undefined
              ? realtorData.yearsOfExperience
              : existingRealtor.yearsOfExperience,
          specialization:
            realtorData.specialization !== undefined
              ? realtorData.specialization
              : existingRealtor.specialization,
          deleteStatus:
            realtorData.deleteStatus !== undefined
              ? realtorData.deleteStatus
              : existingRealtor.deleteStatus,
        };
      } else {
        // If existingRealtor is not provided, create a new RealtorEntity using realtorData
        const realtorEntity: RealtorEntity = {
          id: includeId ? (realtorData._id ? realtorData._id.toString() : undefined) : realtorData._id.toString(),
          firstName: realtorData.firstName,
          lastName: realtorData.lastName,
          address: realtorData.address,
          email: realtorData.email,
          password: realtorData.password,
          phone: realtorData.phone,
          aadharCard: realtorData.aadharCard,
          yearsOfExperience: realtorData.yearsOfExperience,
          specialization: realtorData.specialization,
          deleteStatus: realtorData.deleteStatus,
        };
        return realtorEntity;
      }
    }
  
    static toModel(realtor: RealtorEntity): any {
      return {
        id: realtor.id,
        firstName: realtor.firstName,
          lastName: realtor.lastName,
          address: realtor.address,
          email: realtor.email,
          password: realtor.password,
          phone: realtor.phone,
          aadharCard: realtor.aadharCard,
          yearsOfExperience: realtor.yearsOfExperience,
          specialization: realtor.specialization,
          deleteStatus: realtor.deleteStatus,
      };
    }
  }
  