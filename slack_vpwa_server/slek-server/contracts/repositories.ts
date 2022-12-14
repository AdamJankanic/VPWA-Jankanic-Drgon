/* eslint-disable prettier/prettier */
// here we are declaring our MessageRepository types for Repositories/MessageRepository
// container binding. See providers/AppProvider.ts for how we are binding the implementation
declare module '@ioc:Repositories/MessageRepository' {
  export interface SerializedMessage {
    createdBy: number
    content: string
    channelId: number
    createdAt: string
    updatedAt: string
    id: number
    author: {
      id: number
      email: string
      createdAt: string
      updatedAt: string
    }
  }

  export interface MessageRepositoryContract {
    getMore(name: any, lastMessageId: number): Promise<SerializedMessage[]>
    getAll(channelName: string): Promise<SerializedMessage[]>
    create(channelName: string, userId: number, content: string): Promise<SerializedMessage>
  }

  const MessageRepository: MessageRepositoryContract
  export default MessageRepository
}

//declare our ChannelRepository types for Repositories/ChannelRepository
// container binding. See providers/AppProvider.ts for how we are binding the implementation
declare module '@ioc:Repositories/ChannelRepository' {
  export interface SerializedChannel {
    name: string
    createdAt: string
    updatedAt: string
    id: number
    clen: {
      id: number
      email: string
      createdAt: string
      updatedAt: string
    }
  }

  export interface ChannelRepositoryContract {
    getAll(params: number): Promise<SerializedChannel[]>
    create(owner: number, channelName: string, privatePublic: string): Promise<SerializedChannel>
    getUsers(channelName: string): Promise<any>
    leaveChannel(channelName: string, user: number): Promise<SerializedChannel[]>
    modifySettings(
      owner: number,
      onlineOffline: string,
      DNB: string,
      notifications: string
    ): Promise<any>
    inviteUser(channelName: string, nickname: string): Promise<any>
    inviteChoice(channelName: string, nickname: string, choice: boolean): Promise<any>
    joinViaMessage(channelName: string, userID: number, privatePublic: string): Promise<any>
    revokeUser(channelName: string, nickname: string): Promise<any>
  }
  const ChannelRepository: ChannelRepositoryContract
  export default ChannelRepository
}
