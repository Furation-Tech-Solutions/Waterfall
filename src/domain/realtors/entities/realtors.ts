// Define a class for the RealtorModel, which represents the structure of a Realtor
export class RealtorModel {
  constructor(
    public firstName: string = "",
    public lastName: string = "",
    public email: string = "",
    public contact: number = 0,
    public DOB: string = "",
    public gender: string = "",
    public location: string = "",
    public about: string = "",
    public password: string = "",
    public profileImage: string = "",
    public countryCode: number = 0,
    public deleteStatus: boolean, // You might want to provide a default value here
    public coordinates: { latitude: string; longitude: string } | null = null
  ) { }
}

// Define a class for the RealtorEntity, which represents the data provided by the Realtor Repository
export class RealtorEntity {
  constructor(
    public id: number | undefined = undefined, // Set a default value for id
    public firstName: string,
    public lastName: string,
    public email: string,
    public contact: number,
    public DOB: string,
    public gender: string,
    public location: string,
    public about: string,
    public password: string,
    public profileImage: string,
    public countryCode: number,
    public deleteStatus: boolean,
    public coordinates: { latitude: string; longitude: string } | null = null
  ) { }
}

// Define a RealtorMapper class to convert between RealtorData and RealtorEntity
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
        // Update each property based on whether it exists in realtorData
        firstName: realtorData.firstName !== undefined
          ? realtorData.firstName
          : existingRealtor.firstName,
        lastName: realtorData.lastName !== undefined
          ? realtorData.lastName
          : existingRealtor.lastName,
        email: realtorData.email !== undefined
          ? realtorData.email
          : existingRealtor.email,
        contact: realtorData.contact !== undefined
          ? realtorData.contact
          : existingRealtor.contact,
        DOB: realtorData.DOB !== undefined
          ? realtorData.DOB
          : existingRealtor.DOB,
        gender: realtorData.gender !== undefined
          ? realtorData.gender
          : existingRealtor.gender,
        location: realtorData.location !== undefined
          ? realtorData.location
          : existingRealtor.location,
        about: realtorData.about !== undefined
          ? realtorData.about
          : existingRealtor.about,
        password: realtorData.password !== undefined
          ? realtorData.password
          : existingRealtor.password,
        profileImage: realtorData.profileImage !== undefined
          ? realtorData.profileImage
          : existingRealtor.profileImage,
        countryCode: realtorData.countryCode !== undefined
          ? realtorData.countryCode
          : existingRealtor.countryCode,
        deleteStatus: realtorData.deleteStatus !== undefined
          ? realtorData.deleteStatus
          : existingRealtor.deleteStatus,
        coordinates: realtorData.coordinates !== undefined
          ? realtorData.coordinates
          : existingRealtor.coordinates
      };
    } else {
      // If existingRealtor is not provided, create a new RealtorEntity using realtorData
      const realtorEntity: RealtorEntity = {
        id: includeId ? (realtorData.id ? realtorData.id : undefined) : realtorData.id,
        firstName: realtorData.firstName,
        lastName: realtorData.lastName,
        email: realtorData.email,
        contact: realtorData.contact,
        DOB: realtorData.DOB,
        gender: realtorData.gender,
        location: realtorData.location,
        about: realtorData.about,
        password: realtorData.password,
        profileImage: realtorData.profileImage,
        countryCode: realtorData.countryCode,
        deleteStatus: realtorData.deleteStatus,
        coordinates: realtorData.coordinates || null
      };
      return realtorEntity;
    }
  }

  static toModel(realtor: RealtorEntity): any {
    // Convert a RealtorEntity to a RealtorModel or plain object for the model
    return {
      firstName: realtor.firstName,
      lastName: realtor.lastName,
      email: realtor.email,
      contact: realtor.contact,
      DOB: realtor.DOB,
      gender: realtor.gender,
      location: realtor.location,
      about: realtor.about,
      password: realtor.password,
      profileImage: realtor.profileImage,
      countryCode: realtor.countryCode,
      deleteStatus: realtor.deleteStatus,
      coordinates: realtor.coordinates
    };
  }
}
