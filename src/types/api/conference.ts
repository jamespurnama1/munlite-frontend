import { getGSL } from './gsl';
import { getAllDelegates } from './delegates';
import { getMotionsLog } from './motions';

export interface getAllConferences {
  _id: string;
  title: string;
  start_date: string;
  end_date: string;
  rules: {
    majority: string;
    dr_vote: string;
    quorum: string;
    rounding: string;
  };
  chairman: chairman[];
  delegates: getAllDelegates[];
  gsl?: getGSL;
  motions?: {
    current: number;
    batches: getMotionsLog[];
  }
}

interface chairman {
  _id: string;
  email: string;
}

export interface getConference extends getAllConferences {}

export interface getMyConferences extends getAllConferences {}

export interface updateConference {
  title: string;
  start_date: string;
  end_date: string;
  majority: string;
  dr_vote: string;
  quorum: string;
  rounding: string;
}

export interface createConference extends updateConference {
  chairman: string[];
}
