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

  //add new channel to the existing channels
  LOADING_ALL_CHANNELS(state, channels) {
    // state.messages[channel].push(message);
    console.log('v mutation');
    for (let i = 0; i < channels.length; i++) {
      console.log(channels[i].name);
      state.channels.push(channels[i].name);
    }
  },
};

export default mutation;
