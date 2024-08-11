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

export interface ImageObject {
  user_id: string;
  thumbnail_image: string;
  s3_key_thumbnail: string;
  s3_key: string;
  original_image: string;
  image_id: string;
  filename: string;
  created_at: string;
}

export interface ImageUploader {
  filename: string;
  upload_url: string;
}
