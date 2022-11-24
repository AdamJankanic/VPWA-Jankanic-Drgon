import { RawMessage, SerializedMessage } from 'src/contracts';
import { BootParams, SocketManager } from './SocketManager';

// creating instance of this class automatically connects to given socket.io namespace
// subscribe is called with boot params, so you can use it to dispatch actions for socket events
// you have access to socket.io socket using this.socket
class ChannelSocketManager extends SocketManager {
  public subscribe({ store }: BootParams): void {
    const channel = this.namespace.split('/').pop() as string;

    this.socket.on('message', (message: SerializedMessage) => {
      store.commit('channels/NEW_MESSAGE', { channel, message });
    });
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
  public loadAllUsersInChannel(channelID: number): Promise<string[]> {
    console.log('channel service' + channelID);
    return this.emitAsync('loadUsers', channelID);
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
