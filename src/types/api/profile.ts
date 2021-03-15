export interface getUserData {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role?: string;
}

export interface checkUser {
  found: boolean;
  user_name: {
    first_name: string;
    last_name: string;
  };
}
