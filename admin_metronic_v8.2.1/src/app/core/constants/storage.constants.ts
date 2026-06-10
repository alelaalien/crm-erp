import { environment } from "src/environments/environment";

 
const PREFIX = `${environment.appVersion}-${environment.USERDATA_KEY}`;

export const StoragKeys = {
 
  TOKEN: `${PREFIX}-token`,
  USER: `${PREFIX}-user`,
} 
 