import { User } from './Auth';

export type RawMessage = string;

export interface SerializedMessage {
  createdBy: number;
  content: string;
  channelId: number;
  createdAt: string;
  updatedAt: string;
  id: number;
  author: User;
}

export interface SerializedChannel {
  id: number;
  name: string;
  private: boolean;
  createdAt: string;
  updatedAt: string;
  owner: number;
}
