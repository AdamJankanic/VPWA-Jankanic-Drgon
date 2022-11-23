/* eslint-disable prettier/prettier */
import type {
  ChannelRepositoryContract,
  SerializedChannel,
} from '@ioc:Repositories/ChannelRepository'
import User from 'App/Models/User'
import Channel from 'App/Models/Channel'
import Database from '@ioc:Adonis/Lucid/Database'

export default class ChannelRepository implements ChannelRepositoryContract {
  //get all channels for user
  public async getAll(userId: number): Promise<SerializedChannel[]> {
    // const user = await User.query()
    //   .where('id', userId)
    //   .preload('channels', (channelsQuery) =>
    //     channelsQuery
    //       .preload('clen')
    //       .orderBy('id', 'desc')
    //       .joinRaw('JOIN users ON users.id = channel_users.user_id')
    //       .joinRaw('JOIN channels ON channels.id = channel_users.channel_id')
    //   )
    //   .orderBy('id', 'asc')
    //   .firstOrFail()

    const user = await Database.rawQuery(
      'SELECT channels.name FROM channels \
    JOIN channel_users ON channel_users.channel_id = channels.id \
    JOIN users on channel_users.user_id = users.id\
    WHERE users.id = ?',
      [userId]
    )
    console.log(user)
    return [...user]
    // return user.channels.map((channel) => channel.serialize() as SerializedChannel)
  }

  public async create(name: string): Promise<SerializedChannel> {
    const channel = await Channel.create({ name })

    return channel.serialize() as SerializedChannel
  }
}
