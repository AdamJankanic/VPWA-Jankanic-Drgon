import { SerializedMessage } from 'src/contracts';

export interface ChannelsStateInterface {
  loading: boolean;
  error: Error | null;
  messages: { [channel: string]: SerializedMessage[] };
  active: string | null;
  channels: string[];
  users: string[];
  notification: { userName: string; message: string; channel: string };
}

function state(): ChannelsStateInterface {
  return {
    loading: false,
    error: null,
    messages: {},
    active: null,
    channels: [],
    users: [],
    notification: { userName: '', message: '', channel: '' },
  };
}

export default state;
