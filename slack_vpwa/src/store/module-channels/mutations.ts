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
    state.messages[channel].unshift(...newMessage);
  },

  // set notification message
  SET_NOTIFICATION(
    state,
    {
      userName,
      message,
      channel,
    }: { userName: string; message: string; channel: string }
  ) {
    state.notification.userName = userName;
    state.notification.message = message;
    state.notification.channel = channel;
  },

  //add new channel to the existing channels
  LOADING_ALL_CHANNELS(state, channels) {
    // state.messages[channel].push(message);
    state.channels = [];
    for (let i = 0; i < channels.length; i++) {
      state.channels.push(channels[i].name);
    }
  },

  LOADING_JOINED_USERS(state, users) {
    //console.log(users);
    state.users = [];
    for (let i = 0; i < users.length; i++) {
      state.users.push(users[i].nickname);
    }
  },

  ADD_NEW_CHANNEL(state, channel) {
    state.channels.push(channel[0].name);
  },
};

export default mutation;
