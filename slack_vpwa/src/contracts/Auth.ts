export interface ApiToken {
  type: 'bearer';
  token: string;
  expires_at?: string;
  expires_in?: number;
}

export interface RegisterData {
  email: string;
  password: string;
  passwordConfirmation: string;
  nickname: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember: boolean;
}

export interface User {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
  nickname: string;
  isOnline: boolean;
  isDnd: boolean;
  onlyMentions: boolean;
}
