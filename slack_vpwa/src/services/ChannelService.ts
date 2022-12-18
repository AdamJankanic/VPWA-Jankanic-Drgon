import { RawMessage, SerializedMessage } from 'src/contracts';
import { BootParams, SocketManager } from './SocketManager';
import { channelService } from 'src/services';

// creating instance of this class automatically connects to given socket.io namespace
// subscribe is called with boot params, so you can use it to dispatch actions for socket events
// you have access to socket.io socket using this.socket
class ChannelSocketManager extends SocketManager {
  public subscribe({ store }: BootParams): void {
    const channel = this.namespace.split('/').pop() as string;
    this.socket.on('message', (message: SerializedMessage) => {
      store.commit('channels/NEW_MESSAGE', { channel, message });
      store.commit('channels/SET_NOTIFICATION', {
        userName: message.author.nickname,
        message: message.content,
        channel: channel,
      });
    });

    this.socket.on('leaveChannelResponse', (channelName: string) => {
      console.log('TEST LOG EMIT ZO SERVERA VSETKYM', channelName);

      store.commit('channels/CLEAR_CHANNEL', channelName);
      store.commit('channels/REMOVE_CHANNEL', channelName);

      if (channelName == store.state.channels.active) {
        store.commit('channels/SET_ACTIVE', 'Slack');
      }

      channelService.leave(channelName);
    });

    this.socket.on(
      'inviteUserResponse',
      (channelName: string, nickname: string, channel) => {
        const user = store.state.auth.user;
        console.log('UKAZ SA PIKACHU', channel);
        console.log(channel);
        if (nickname == user?.nickname) {
          console.log('ANO, SOM TO JA');
          store.commit('channels/ADD_NEW_CHANNEL', channel);
        } else {
          console.log('NIE SOM TO JA');
        }
      }
    );

    this.socket.on(
      'revokeUserResponse',
      (channelName: string, nickname: string) => {
        const user = store.state.auth.user;
        if (nickname == user?.nickname) {
          store.commit('channels/CLEAR_CHANNEL', channelName);
          store.commit('channels/REMOVE_CHANNEL', channelName);
          channelService.leave(channelName);
        }
      }
    );
  }

  public addMessage(message: RawMessage): Promise<SerializedMessage> {
    return this.emitAsync('addMessage', message);
  }

  public loadMessages(): Promise<SerializedMessage[]> {
    return this.emitAsync('loadMessages');
  }

  //load more messages
  public loadMoreMessages(lastMessageId: number): Promise<SerializedMessage[]> {
    return this.emitAsync('loadMoreMessages', lastMessageId);
  }

  //load all channels for the user
  public loadAllChannels(userId: number): Promise<string[]> {
    console.log('trying to load all channels');
    return this.emitAsync('loadChannels', userId);
  }

  //load all user in active channel
  public loadAllUsersInChannel(channelName: string): Promise<string[]> {
    console.log('channel service' + channelName);
    return this.emitAsync('loadUsers', channelName);
  }

  public addChannel(owner: number, channelName: string, privatePublic: string) {
    return this.emitAsync('addChannel', owner, channelName, privatePublic);
  }

  public leaveChannel(channelName: string, user: number) {
    return this.emitAsync('leaveChannel', channelName, user);
  }

  public modifySettings(
    owner: number,
    onlineOffline: string,
    DNB: string,
    notifications: string
  ) {
    console.log(
      'trying to modify settings',
      owner,
      onlineOffline,
      DNB,
      notifications
    );
    return this.emitAsync(
      'modifySettings',
      owner,
      onlineOffline,
      DNB,
      notifications
    );
  }

  public inviteUser(channelName: string, nickname: string) {
    console.log('trying to invite user', channelName, nickname);
    return this.emitAsync('inviteUser', channelName, nickname);
  }

  public inviteChoice(channelName: string, nickname: string, choice: boolean) {
    return this.emitAsync('inviteChoice', channelName, nickname, choice);
  }

  public joinViaMessage(
    channelName: string,
    userID: number,
    privatePublic: string
  ) {
    return this.emitAsync('joinViaMessage', channelName, userID, privatePublic);
  }

  public revokeUser(channelName: string, nickname: string) {
    return this.emitAsync('revokeUser', channelName, nickname);
  }
}

class ChannelService {
  private channels: Map<string, ChannelSocketManager> = new Map();

  public join(name: string): ChannelSocketManager {
    if (this.channels.has(name)) {
      throw new Error(`User is already joined in channel "${name}"`);
    }

    // connect to given channel namespace
    const channel = new ChannelSocketManager(`/channels/${name}`);
    this.channels.set(name, channel);
    return channel;
  }

  public leave(name: string): boolean {
    const channel = this.channels.get(name);

    if (!channel) {
      return false;
    }

    // disconnect namespace and remove references to socket
    channel.destroy();
    return this.channels.delete(name);
  }

  public in(name: string): ChannelSocketManager | undefined {
    return this.channels.get(name);
  }

  public starting(name: string): ChannelSocketManager {
    const channel = new ChannelSocketManager(`/channels/${name}`);
    this.channels.set(name, channel);
    return channel;
  }
}

export default new ChannelService();
