export interface getAllDelegates {
    _id: string;
    country: string;
    status: string;
}

export interface addDelegates {
  country: string;
  status: string;
}

export interface editDelegates {
  country: string;
  status: string;
}
