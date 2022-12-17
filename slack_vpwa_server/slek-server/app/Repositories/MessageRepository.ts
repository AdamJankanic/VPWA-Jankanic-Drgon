import type {
  MessageRepositoryContract,
  SerializedMessage,
} from '@ioc:Repositories/MessageRepository'
import Channel from 'App/Models/Channel'
import Database from '@ioc:Adonis/Lucid/Database'

export default class MessageRepository implements MessageRepositoryContract {
  public async getAll(channelName: string): Promise<SerializedMessage[]> {
    const channel = await Channel.query()
      .where('name', channelName)
      .preload('messages', (messagesQuery) =>
        messagesQuery.preload('author').orderBy('id', 'desc').limit(20)
      )
      .orderBy('id', 'asc')
      .firstOrFail()

    return channel.messages.map((message) => message.serialize() as SerializedMessage)
  }

  public async create(
    channelName: string,
    userId: number,
    content: string
  ): Promise<SerializedMessage> {
    const channel = await Channel.findByOrFail('name', channelName)
    const message = await channel.related('messages').create({ createdBy: userId, content })
    await message.load('author')

    let time = new Date().toISOString().slice(0, 19).replace('T', ' ')
    await Database.rawQuery('UPDATE channels SET updated_at = ? WHERE channels.name = ?', [
      time,
      channelName,
    ])

    return message.serialize() as SerializedMessage
  }

  //getmore messages
  public async getMore(channelName: string, lastMessageId: number): Promise<SerializedMessage[]> {
    const channel = await Channel.query()
      .where('name', channelName)
      .preload('messages', (messagesQuery) =>
        messagesQuery
          .preload('author')
          .where('id', '<', lastMessageId)
          .orderBy('id', 'desc')
          .limit(10)
      )
      .firstOrFail()

    return channel.messages.map((message) => message.serialize() as SerializedMessage)
  }
}
