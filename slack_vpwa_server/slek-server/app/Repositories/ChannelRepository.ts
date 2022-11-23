import type {
  ChannelRepositoryContract,
  SerializedChannel,
} from '@ioc:Repositories/ChannelRepository'
import User from 'App/Models/User'
import Channel from 'App/Models/Channel'

export default class ChannelRepository implements ChannelRepositoryContract {
  //get all channels for user
  public async getAll(userId: number): Promise<SerializedChannel[]> {
    const channels = await User.query()
      .where('id', userId)
      .preload('channels', (channelsQuery) =>
        channelsQuery
          .preload('users')
          .orderBy('id', 'desc')
          .joinRaw('INNER JOIN users ON users.id = channel_users.user_id')
          .joinRaw('INNER JOIN channels ON channels.id = channel_users.channel_id')
      )
      .orderBy('id', 'asc')
      .firstOrFail()

    return channels.map((channel) => channel.serialize() as SerializedChannel)
  }

  //get all channels for user
  public async getChannel(name: string): Promise<SerializedChannel> {
    const channel = await Channel.query()
      .where('name', name)
      .preload('users', (usersQuery) =>
        usersQuery
          .orderBy('id', 'desc')
          .joinRaw('INNER JOIN users ON users.id = channel_users.user_id')
          .joinRaw('INNER JOIN channels ON channels.id = channel_users.channel_id')
      )
      .orderBy('id', 'asc')
      .firstOrFail()

    return channel.serialize() as SerializedChannel
  }

  public async create(name: string): Promise<SerializedChannel> {
    const channel = await Channel.create({ name })

    return channel.serialize() as SerializedChannel
  }
}
