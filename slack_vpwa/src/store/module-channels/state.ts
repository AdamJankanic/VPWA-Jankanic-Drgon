import { SerializedMessage } from 'src/contracts';

export interface ChannelsStateInterface {
  loading: boolean;
  error: Error | null;
  messages: { [channel: string]: SerializedMessage[] };
  active: string | null;
  channels: string[];
  users: string[];
}

function state(): ChannelsStateInterface {
  return {
    loading: false,
    error: null,
    messages: {},
    active: null,
    channels: [],
    users: [],
  };
}

export default state;
