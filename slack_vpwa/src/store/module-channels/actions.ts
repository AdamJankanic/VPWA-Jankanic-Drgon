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
      const channels = await channelService
        .starting('starting_channel')
        .loadAllChannels(userId);
      await channelService.leave('starting_channel');
      if (channels) {
        commit('LOADING_ALL_CHANNELS', channels);
      }
      return channels;
    } catch (err) {
      commit('LOADING_ERROR', err);
      throw err;
    }
  },

  //load all users in active channel
  async loadAllUsersInChannel(
    { commit },
    { channelName }: { channelName: string }
  ) {
    try {
      console.log('v action pred nacitanim' + channelName);
      const users = await channelService
        .in(channelName)
        ?.loadAllUsersInChannel(channelName);
      if (users) {
        commit('LOADING_JOINED_USERS', users);
      }
      return users;
      // return users;
    } catch (err) {
      // commit('LOADING_ERROR', err);
      throw err;
    }
  },

  async addChannel(
    { commit },
    {
      owner,
      newChannelName,
      privatePublic,
    }: { owner: number; newChannelName: string; privatePublic: string }
  ) {
    try {
      const newChannel = await channelService
        .starting('starting_channel')
        .addChannel(owner, newChannelName, privatePublic);
      console.log('v action po addChannel', newChannel);
      await channelService.leave('starting_channel');

      if (newChannel) {
        commit('ADD_NEW_CHANNEL', newChannel);
        await this.dispatch('channels/join', newChannelName, {
          root: true,
        });
        return newChannel;
      }
    } catch (err) {
      throw err;
    }
  },

  async leaveChannel(
    { commit },
    { channelName, user }: { channelName: string; user: number }
  ) {
    try {
      const channels = await channelService
        .in('general')
        ?.leaveChannel(channelName, user);

      channelService.leave(channelName);

      if (channels) {
        commit('LOADING_ALL_CHANNELS', channels);
        // delete messeges from the channel
        commit('CLEAR_CHANNEL', channelName);
      }
    } catch (err) {
      throw err;
    }
  },

  // async modifySettings(
  //   { commit },
  //   {
  //     owner,
  //     onlineOffline,
  //     DNB,
  //     notifications,
  //   }: {
  //     owner: number;
  //     onlineOffline: string;
  //     DNB: string;
  //     notifications: string;
  //   }
  // ) {
  //   try {
  //     console.log('ACTIONS MODIFY SETTINGS');
  //     const user = await channelService
  //       .starting('starting_channel')
  //       .modifySettings(owner, onlineOffline, DNB, notifications);
  //     await channelService.leave('starting_channel');

  //     console.log(
  //       'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  //       user
  //     );
  //   } catch (err) {
  //     throw err;
  //   }
  // },

  //invite user to channel

  async inviteUser(
    { commit },
    { channelName, nickname }: { channelName: string; nickname: string }
  ) {
    console.log('v action pred invite' + channelName + nickname);
    try {
      const channels = await channelService
        .in('general')
        ?.inviteUser(channelName, nickname);
      1;
    } catch (err) {
      throw err;
    }
  },

  async inviteChoice(
    { commit },
    {
      channelName,
      nickname,
      choice,
    }: { channelName: string; nickname: string; choice: boolean }
  ) {
    try {
      console.log('v action pred inviteChoice', channelName, nickname, choice);
      const channels = await channelService
        .in('general')
        ?.inviteChoice(channelName, nickname, choice);
      console.log('v action po inviteChoice', channels);
      commit('UPDATE_CHANNELS', channels);

      if (choice) {
        this.dispatch('channels/join', channelName);
      }
    } catch (err) {
      throw err;
    }
  },

  async joinViaMessage(
    { commit },
    {
      channelName,
      userID,
      privatePublic,
    }: { channelName: string; userID: number; privatePublic: string }
  ) {
    try {
      console.log(
        'v action pred joinViaMessage',
        channelName,
        userID,
        privatePublic
      );
      const channel = await channelService
        .in('general')
        ?.joinViaMessage(channelName, userID, privatePublic);

      if (channel !== 0) {
        commit('ADD_NEW_CHANNEL', channel);
        this.dispatch('channels/join', channelName);
      }
    } catch (err) {
      throw err;
    }
  },

  async revokeUser(
    { commit },
    { channelName, nickname }: { channelName: string; nickname: string }
  ) {
    try {
      await channelService.in('general')?.revokeUser(channelName, nickname);
      // commit('UPDATE_CHANNELS', channels);
    } catch (err) {
      throw err;
    }
  },
};

export default actions;
