import { IUser } from './IAuth';
import { IPatient } from './IPatient';

export interface IVisit {
  id: number;
  patient_id: number;
  type: 'IPD' | 'OPD';
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface IVisitWithMetaData {
  id: number;
  patient: IPatient;
  type: 'IPD' | 'OPD';
  status: string;
  created_by: IUser;
  created_at: string;
  updated_at: string;
}
