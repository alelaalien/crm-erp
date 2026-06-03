export interface Branch {
  id?: number;
  name: string;
  address?: string;
  status?: boolean | number;
  created_at?: string;
  updated_at?: string;
  latitude?: number,
  longitude?: number
}