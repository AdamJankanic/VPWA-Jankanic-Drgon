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
    const user = await Database.rawQuery(
      'SELECT channels.name FROM channels \
    JOIN channel_users ON channel_users.channel_id = channels.id \
    JOIN users on channel_users.user_id = users.id\
    WHERE users.id = ?',
      [userId]
    )
    console.log(user)
    return [...user]
  }

  //get all users in channel
  public async getUsers(channelId: number): Promise<User[]> {
    console.log('channel id server ' + channelId)
    const users = await Database.rawQuery(
      'SELECT users.id, users.nickname FROM users \
    JOIN channel_users ON channel_users.user_id = users.id \
    JOIN channels on channel_users.channel_id = channels.id\
    WHERE channels.id = ?',
      [channelId]
    )
    console.log(users)
    return [...users]
  }

  public async create(name: string): Promise<SerializedChannel> {
    const channel = await Channel.create({ name })

    return channel.serialize() as SerializedChannel
  }
}
