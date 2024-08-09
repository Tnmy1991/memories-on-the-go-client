export interface CreateAccountPayload {
  name: string;
  phone_number: string;
  username: string;
  password: string;
  confirm_password: string;
}

export interface LookupPayload {
  key: string;
  value: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  displayName: string;
  message: string;
}
