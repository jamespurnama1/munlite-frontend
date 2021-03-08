export interface caucusLog {
  caucus_number: number;
  motion: {
    _id: string;
    name: string;
    proposer: string;
    speaking_time: number;
    total_time: number;
    type: string;
    yes_vote: number;
    no_vote: number;
  }
  current: number;
  length: number;
  queue: [
    {
      order: number;
      delegate_id: string;
      time: number;
    }
  ]
}

export interface createCaucus {
  id: string;
  name: string;
  proposer: string;
  speaking_time: number;
  total_time: number;
  type: string;
  yes_vote: number;
  no_vote: number;
}

export interface currentCaucus extends caucusLog {}

export interface updateCaucus extends createCaucus {}

export interface addTurn {
  delegate_id: string;
  time_start: number;
  time_left: number;
}

export interface timeLeft {
  order: number;
  time_left: number;
}
