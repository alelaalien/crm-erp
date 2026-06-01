import { UserDTO } from 'src/app/dtos/user.dto';
import { AuthModel } from '../modules/auth/models/auth.model';

export class UserModel extends AuthModel {
  id: number;
  username: string;
 
  fullname: string;
  email: string;
  avatar: string;

  permissions: string[] = [];
  roles: string[] = [];
  password: string;
  occupation: string;
  companyName: string;
  phone: string;
  address?: string; 
  
  firstname: string;
  last_name: string;
  website: string;
  language: string;
  timeZone: string;
 
  communication = { email: true, sms: true, phone: true };
  emailSettings?: any;

  setUser(data: UserDTO) {
   
    this.id = data.id;
    this.email = data.email;
    this.fullname =   `${data.name} ${data.last_name || ''}`;
    this.firstname = data.name;
    this.last_name = data.last_name || '';
    
    
    this.avatar = data.avatar || './assets/media/avatars/blank.png';
    
 
    this.roles = data.roles || [];
    this.permissions = data.permissions || [];
  
    this.phone = data.phone || '';
   
    this.address = undefined;  
  }
}