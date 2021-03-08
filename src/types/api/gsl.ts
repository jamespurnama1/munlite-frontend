export interface getGSL {
  current: number;
  length: number;
  queue: [
    {
      order: number;
      delegate_id: string;
      time_start: number;
      time_left: number;
      yield?: 'string';
    }
  ]
}

export interface addTurn {
  delegate_id: string;
  time_start: number;
  time_left: number;
  yield: string;
}

export interface timeLeft {
  order: number;
  time_left: number;
}

export interface yieldGSL {
  order: number;
  yield: string;
  time_left?: number;
}

export interface getTurn extends addTurn {
  order: number;
}
