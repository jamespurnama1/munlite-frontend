type Command = 'start' | 'pause' | 'resume' | 'stop' | 'update'
type Session = 'gsl' | 'caucus'

export interface send {
  session: Session;
  order: number,
  command?: Command,
  time?: number;
}

export interface receive {
  session: Session;
  order: number;
  state: 0 | 1 | 2;
  time: number;
}
