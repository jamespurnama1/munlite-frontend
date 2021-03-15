export interface login {
  email: string;
  password: string;
}

export interface signup {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface getJWT {
  access_token: string;
}
