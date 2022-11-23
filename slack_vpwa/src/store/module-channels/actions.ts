import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ChannelsStateInterface } from './state';
import { channelService } from 'src/services';
import { RawMessage } from 'src/contracts';

const actions: ActionTree<ChannelsStateInterface, StateInterface> = {
  async join({ commit }, channel: string) {
    try {
      commit('LOADING_START');
      const messages = await channelService.join(channel).loadMessages();
      //reverse the order of the messages
      messages.reverse();
      commit('LOADING_SUCCESS', { channel, messages });
    } catch (err) {
      commit('LOADING_ERROR', err);
      throw err;
    }
  },
  async leave({ getters, commit }, channel: string | null) {
    const leaving: string[] =
      channel !== null ? [channel] : getters.joinedChannels;

    leaving.forEach((c) => {
      channelService.leave(c);
      commit('CLEAR_CHANNEL', c);
    });
  },
  async addMessage(
    { commit },
    { channel, message }: { channel: string; message: RawMessage }
  ) {
    const newMessage = await channelService.in(channel)?.addMessage(message);
    commit('NEW_MESSAGE', { channel, message: newMessage });
  },

  //load more messages
  async loadMoreMessages(
    { commit },
    { channel, lastMessageId }: { channel: string; lastMessageId: number }
  ) {
    const newMessage = await channelService
      .in(channel)
      ?.loadMoreMessages(lastMessageId);

    //reverse the order of the messages
    if (newMessage) {
      newMessage.reverse();
    }
    commit('LOADING_MORE_MESSAGES', { channel, newMessage });
  },

  //load all channels for the user
  async loadAllChannels({ commit }, userId: number) {
    try {
      // commit('LOADING_START');

      console.log('pred volanim loadAllChannels v actions');
      // console.log('channel serive ' + (await channelService.in('general')));
      // console.log('channel serive ' + (await channelService.starting('test')));

      const channels = await channelService
        .starting('starting_channel')
        .loadAllChannels(userId);
      await channelService.leave('starting_channel');
      if (channels) {
        // console.log(...channels);
        commit('LOADING_ALL_CHANNELS', channels);
      }
      return channels;
    } catch (err) {
      commit('LOADING_ERROR', err);
      throw err;
    }
  },
};

export default actions;
