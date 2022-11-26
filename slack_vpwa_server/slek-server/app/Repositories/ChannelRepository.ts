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
    return [...user]
  }

  //get all users in channel
  public async getUsers(channelName: string): Promise<User[]> {
    console.log('channel id server ' + channelName)
    const users = await Database.rawQuery(
      'SELECT users.id, users.nickname FROM users \
    JOIN channel_users ON channel_users.user_id = users.id \
    JOIN channels on channel_users.channel_id = channels.id\
    WHERE channels.name = ?',
      [channelName]
    )
    return [...users]
  }

  public async create(
    owner: number,
    channelName: string,
    privatePublic: string
  ): Promise<SerializedChannel> {
    let privatny: boolean
    if (privatePublic === 'private') {
      privatny = true
    } else {
      privatny = false
    }

    let time = new Date().toISOString().slice(0, 19).replace('T', ' ')

    await Database.rawQuery(
      'INSERT into channels(name, created_at, updated_at, private, creator_id) values(?, ?, ?, ?, ?)',
      [channelName, time, time, privatny, owner]
    )

    let channel = await Database.rawQuery('SELECT * from channels where name = ?', [channelName])

    await Database.rawQuery(
      'INSERT into channel_users(user_id, channel_id, created_at, updated_at) values(?, ?, ?, ?)',
      [owner, channel[0].id, time, time]
    )
    return channel as SerializedChannel
  }

  public async leaveChannel(channelName: string, user: number): Promise<any> {
    const creatorId = await Database.rawQuery('select creator_id from channels where name = ?', [
      channelName,
    ])
    const channelId = await Database.rawQuery('select id from channels where name = ?', [
      channelName,
    ])

    if (user === creatorId[0].creator_id) {
      await Database.rawQuery('delete from channels where name = ?', [channelName])
      await Database.rawQuery('delete from messages where channel_id = ?', [channelId[0].id])
    } else {
      console.log(channelId[0].id)

      await Database.rawQuery('delete from channel_users where channel_id = ? and user_id = ?', [
        channelId[0].id,
        user,
      ])
    }

    const channels = await this.getAll(user)

    console.log(channels)

    return channels
  }
}
