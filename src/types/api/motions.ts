export interface getMotionsLog {
  batch_number: number;
  batch_motions: [
    {
      _id: string;
      name: string;
      proposer: string;
      speaking_time: number;
      total_time: number;
      type: string;
      yes_vote: number;
      no_vote: number;
    },
  ];
  start_time: string;
  motion_id: string;
}

export interface addMotion {
  name: string;
  proposer: string;
  speaking_time: number;
  total_time: number;
  type: string;
  yes_vote: number;
  no_vote: number;
}

export interface getMotions extends addMotion {
  _id: string;
}

export interface updateMotion extends getMotions {}

export interface startCaucus {
  motion_id: string;
}
