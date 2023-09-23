import { SuperAdminEntity, SuperAdminModel } from "@domain/super-admin/entities/super-admin.entity";
import { Document, Model } from "mongoose";

export interface IAdminModel extends Document {
  _id: string;
  email: string;
  phone: number,
  brand: string,
  jobTitle: string,
  superAdmin: boolean,
  admin: boolean,
  permissions: number[],
  active: boolean,
  outlet: string
}

export interface SuperAdminDataSource {
    create(superAdmin: SuperAdminModel): Promise<any>; 
    update(id: string, superadmin: SuperAdminModel): Promise<any>; 
    delete(id: string): Promise<void>;
    read(id: string): Promise<SuperAdminEntity>; 
    getAllAdmins(): Promise<SuperAdminEntity[]>; // 
  }