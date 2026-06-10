import { PermissionDto } from "./permission.dto";
import { RolesDto } from "./role.dto";

export type Gender = 'M' | 'F' | 'N';

export interface UserDTO {
  id: number;  
  name: string;
  last_name?: string;
  avatar?: string;
  last_seen_at?: string;  
  gender?: Gender;
  phone?: string;
  address?: string;
  email: string;
  email_verified_at?: string;
  password?: string; 
  remember_token?: string;
  created_at?: string;
  updated_at?: string;
  doc_type?: string;
  doc_number?: string;
  branch_id?: number;
  deleted_at?: string; 
   
  permissions?: string []; //PermissionDto[];
  roles_names?:string [];
  roles?: RolesDto[];
  
}