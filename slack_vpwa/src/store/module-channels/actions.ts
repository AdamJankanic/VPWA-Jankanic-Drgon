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
    // console.log('load more messages ' + channel);
    commit('LOADING_START');

    const newMessage = await channelService
      .in(channel)
      ?.loadMoreMessages(lastMessageId);
    // console.log('bububu after loading' + channel);
    commit('LOADING_SUCCESS', { channel, newMessage });
    console.log(newMessage);
    // update the state

    // commit('LOADING_MORE_MESSAGES', { channel, newMessage });

    // commit('NEW_MESSAGE', { channel, message: newMessage });
  },
};

export default actions;
