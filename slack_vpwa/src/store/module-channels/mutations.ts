import { SerializedMessage } from 'src/contracts';
import { MutationTree } from 'vuex';
import { ChannelsStateInterface } from './state';

const mutation: MutationTree<ChannelsStateInterface> = {
  LOADING_START(state) {
    state.loading = true;
    state.error = null;
  },
  LOADING_SUCCESS(
    state,
    { channel, messages }: { channel: string; messages: SerializedMessage[] }
  ) {
    state.loading = false;
    state.messages[channel] = messages;
  },
  LOADING_ERROR(state, error) {
    state.loading = false;
    state.error = error;
  },
  CLEAR_CHANNEL(state, channel) {
    state.active = null;
    delete state.messages[channel];
  },
  SET_ACTIVE(state, channel: string) {
    state.active = channel;
  },
  NEW_MESSAGE(
    state,
    { channel, message }: { channel: string; message: SerializedMessage }
  ) {
    state.messages[channel].push(message);
  },
  // append new messages to the existing messages
  LOADING_MORE_MESSAGES(
    state,
    {
      channel,
      newMessage,
    }: { channel: string; newMessage: SerializedMessage[] }
  ) {
    console.log(...newMessage);
    console.log(state.messages[channel]);
    state.messages[channel].unshift(...newMessage);
  },
};

export default mutation;
