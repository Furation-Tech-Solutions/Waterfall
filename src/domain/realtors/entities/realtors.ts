// Define a class for the RealtorModel, which represents the structure of a Realtor
export class RealtorModel {
  constructor(
    public id: string = "",
    public firstName: string = "",
    public lastName: string = "",
    public email: string = "",
    public contact: string = "",
    public DOB: string = "",
    public gender: string = "",
    public location: string = "",
    public about: string = "",
    public profileImage: string = "",
    public countryCode: number = 0,
    public deleteStatus: boolean,
    public coordinates: { latitude: string; longitude: string } | null = null,
    public recoId: string = "",
    public linkedIn: string = "",
    public attachmentLink: string = "",
    public licenseExpirationDate: string = "",
    public badge: { badgeName: string, timestamp: Date },
    public isBanned: boolean = false,
    public reportCount: number = 0,
    public firebaseDeviceToken: string[] = [],
    public connectedAccountId: string = ""


  ) { }
}

// Define a class for the RealtorEntity, which represents the data provided by the Realtor Repository
export class RealtorEntity {
  constructor(
    public id: string, // Set a default value for id
    public firstName: string,
    public lastName: string,
    public email: string,
    public contact: string,
    public DOB: string,
    public gender: string,
    public location: string,
    public about: string,
    public profileImage: string,
    public countryCode: number,
    public deleteStatus: boolean,
    public coordinates: { latitude: string; longitude: string } | null = null,
    public recoId: string,
    public linkedIn: string,
    public attachmentLink: string,
    public licenseExpirationDate: string,
    public badge: { badgeName: string; timestamp: Date },
    public isBanned: boolean,
    public reportCount: number,
    public connectedAccountId: string,
    public firebaseDeviceToken: string[]


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
        id:
          includeId && realtorData.id !== undefined
            ? realtorData.id
            : existingRealtor.id,

        firstName:
          realtorData.firstName !== undefined
            ? realtorData.firstName
            : existingRealtor.firstName,
        lastName:
          realtorData.lastName !== undefined
            ? realtorData.lastName
            : existingRealtor.lastName,
        email:
          realtorData.email !== undefined
            ? realtorData.email
            : existingRealtor.email,
        contact:
          realtorData.contact !== undefined
            ? realtorData.contact
            : existingRealtor.contact,
        DOB:
          realtorData.DOB !== undefined ? realtorData.DOB : existingRealtor.DOB,
        gender:
          realtorData.gender !== undefined
            ? realtorData.gender
            : existingRealtor.gender,
        location:
          realtorData.location !== undefined
            ? realtorData.location
            : existingRealtor.location,
        about:
          realtorData.about !== undefined
            ? realtorData.about
            : existingRealtor.about,
        profileImage:
          realtorData.profileImage !== undefined
            ? realtorData.profileImage
            : existingRealtor.profileImage,
        countryCode:
          realtorData.countryCode !== undefined
            ? realtorData.countryCode
            : existingRealtor.countryCode,
        deleteStatus:
          realtorData.deleteStatus !== undefined
            ? realtorData.deleteStatus
            : existingRealtor.deleteStatus,
        coordinates:
          realtorData.coordinates !== undefined
            ? realtorData.coordinates
            : existingRealtor.coordinates,
        recoId:
          realtorData.recoId !== undefined
            ? realtorData.recoId
            : existingRealtor.recoId,
        connectedAccountId:
          realtorData.connectedAccountId !== undefined
            ? realtorData.connectedAccountId
            : existingRealtor.connectedAccountId,
        linkedIn:
          realtorData.linkedIn !== undefined
            ? realtorData.linkedIn
            : existingRealtor.linkedIn,
        attachmentLink:
          realtorData.attachmentLink !== undefined
            ? realtorData.attachmentLink
            : existingRealtor.attachmentLink,
        licenseExpirationDate:
          realtorData.licenseExpirationDate !== undefined
            ? realtorData.licenseExpirationDate
            : existingRealtor.licenseExpirationDate,
        badge:
          realtorData.badge !== undefined
            ? realtorData.badge
            : existingRealtor.badge,
        isBanned:
          realtorData.isBanned !== undefined
            ? realtorData.isBanned
            : existingRealtor.isBanned,
        reportCount:
          realtorData.reportCount !== undefined
            ? realtorData.reportCount
            : existingRealtor.reportCount,
        firebaseDeviceToken:
          realtorData.firebaseDeviceToken !== undefined
            ? realtorData.firebaseDeviceToken
            : existingRealtor.firebaseDeviceToken
      };
    } else {
      // If existingRealtor is not provided, create a new RealtorEntity using realtorData
      const realtorEntity: RealtorEntity = {
        id: realtorData.id,
        // id: includeId
        //   ? realtorData.id
        //     ? realtorData.id
        //     : undefined
        //   : realtorData.id,
        firstName: realtorData.firstName,
        lastName: realtorData.lastName,
        email: realtorData.email,
        contact: realtorData.contact,
        DOB: realtorData.DOB,
        gender: realtorData.gender,
        location: realtorData.location,
        about: realtorData.about,
        profileImage: realtorData.profileImage,
        countryCode: realtorData.countryCode,
        deleteStatus: realtorData.deleteStatus,
        coordinates: realtorData.coordinates || null,
        recoId: realtorData.recoId,
        connectedAccountId: realtorData.connectedAccountId,
        linkedIn: realtorData.linkedIn,
        attachmentLink: realtorData.attachmentLink,
        licenseExpirationDate: realtorData.licenseExpirationDate,
        badge: realtorData.badge,
        isBanned: realtorData.isBanned,
        reportCount: realtorData.reportCount,
        firebaseDeviceToken: realtorData.firebaseDeviceToken,

      };
      return realtorEntity;
    }
  }

  static toModel(realtor: RealtorEntity): any {
    // Convert a RealtorEntity to a RealtorModel or plain object for the model
    return {
      id: realtor.id,
      firstName: realtor.firstName,
      lastName: realtor.lastName,
      email: realtor.email,
      contact: realtor.contact,
      DOB: realtor.DOB,
      gender: realtor.gender,
      location: realtor.location,
      about: realtor.about,
      profileImage: realtor.profileImage,
      countryCode: realtor.countryCode,
      deleteStatus: realtor.deleteStatus,
      coordinates: realtor.coordinates,
      recoId: realtor.recoId,
      connectedAccountId: realtor.connectedAccountId,
      linkedIn: realtor.linkedIn,
      attachmentLink: realtor.attachmentLink,
      licenseExpirationDate: realtor.licenseExpirationDate,
      badge: realtor.badge,
      isBanned: realtor.isBanned,
      reportCount: realtor.reportCount,
      firebaseDeviceToken: realtor.firebaseDeviceToken
    };
  }
}
