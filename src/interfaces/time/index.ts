import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface TimeInterface {
  id?: string;
  naaligai: number;
  minutes: number;
  sunrise_time: any;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface TimeGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
}
