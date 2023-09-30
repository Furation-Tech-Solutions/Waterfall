// Express API request populate the ClientTagCategoryModel
export class ClientTagCategoryModel {
  constructor(
    public name: string = "",
    public color: string = ""
  ) { }
}

// ClientTagCategoryEntity provided by ClientTagCategory Repository is converted to Express API Response
export class ClientTagCategoryEntity {
  constructor(
    public id: string | undefined = undefined, // Set a default value for id
    public name: string = "",
    public color: string = ""
  ) { }
}

/* ================================================= */
export class ClientTagCategoryMapper {
  static toEntity(
    clientTagCategoryData: any,
    includeId?: boolean,
    existingClientTagCategory?: ClientTagCategoryEntity
  ): ClientTagCategoryEntity {
    if (existingClientTagCategory != null) {
      return {
        ...existingClientTagCategory,
        name:
          clientTagCategoryData.name !== undefined
            ? clientTagCategoryData.name
            : existingClientTagCategory.name,
        color:
          clientTagCategoryData.color !== undefined
            ? clientTagCategoryData.color
            : existingClientTagCategory.color,

      };
    } else {
      const clientTagCategoryEntity: ClientTagCategoryEntity = {
        id: includeId
          ? clientTagCategoryData.id
            ? clientTagCategoryData.id
            : undefined
          : clientTagCategoryData.id,
        name: clientTagCategoryData.name, 
        color: clientTagCategoryData.color
      };
      return clientTagCategoryData;
    }
  }

  static toModel(clientTagCategory: ClientTagCategoryEntity): any {
    return {
      name: clientTagCategory.name,
      color: clientTagCategory.color
    };
  }
}
