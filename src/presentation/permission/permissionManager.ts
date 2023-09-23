export class PermissionManager {
  static permissions = {
    admin: {
      create: 100,
      view: 101,
      update: 102,
      delete: 103,
    },
  };

  static allPermissionCodes: number[] = [];
  // Flatten the permission codes during initialization
  static initializePermissionCodes() {
    this.allPermissionCodes = Object.values(this.permissions)
      .map((role) => Object.values(role))
      .flat();
  }
  static hasPermission(
    permissionCode: number,
    userPermissions: number[]
  ): boolean {
    return userPermissions.includes(permissionCode);
  }
}

