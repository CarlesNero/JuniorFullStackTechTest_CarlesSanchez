export interface Player {
  id?: number;
  username: string;
  email: string;
}

export interface NewPlayer {
  username: string;
  email: string;
  password: string;
}

export interface LoginPlayerDTO {
  id?: number;
  username: string;
  password: string;
}

export interface ApiError {
  error: string;
}
