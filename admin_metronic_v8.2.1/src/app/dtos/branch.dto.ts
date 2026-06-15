import { BranchImageDto } from "./branch-image.dto";
import { PhoneDto } from "./phone.dto";

export interface BranchDto {
  id?: number;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  status?: boolean | number;
  created_at?: string;
  updated_at?: string;
  latitude?: number,
  longitude?: number,
  phones: PhoneDto[],
  images : BranchImageDto[],
}