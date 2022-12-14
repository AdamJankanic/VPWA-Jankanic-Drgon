/* eslint-disable prettier/prettier */
import type {
  ChannelRepositoryContract,
  SerializedChannel,
} from '@ioc:Repositories/ChannelRepository'
import User from 'App/Models/User'

import Database from '@ioc:Adonis/Lucid/Database'

export default class ChannelRepository implements ChannelRepositoryContract {
  //get all channels for user
  public async getAll(userId: number): Promise<SerializedChannel[]> {
    const channels = await Database.rawQuery(
      'SELECT channels.id, channels.name, channels.private, channels.creator_id, channels.updated_at, channel_users.isInvited FROM channels \
    JOIN channel_users ON channel_users.channel_id = channels.id \
    JOIN users on channel_users.user_id = users.id\
    WHERE users.id = ? ORDER BY channel_users.isInvited DESC',
      [userId]
    )

    channels.forEach((channel) => {
      // console.log(channels)
      // delete channel if updated at is older than 30 days
      let date = new Date(channel.updated_at)
      let now = new Date()
      let diff = now.getTime() - date.getTime()
      let days = diff / (1000 * 3600 * 24)
      // console.log(days, date, now, channel.updated_at, channel.name)
      if (days > 30) {
        // console.log('delete channel BOLI SME TU')
        Database.rawQuery('delete from channels where id = ?', [channel.id])
        channels.splice(channels.indexOf(channel), 1)
      }
    })

    return [...channels]
  }

  //get all users in channel
  public async getUsers(channelName: string): Promise<User[]> {
    const users = await Database.rawQuery(
      'SELECT users.id, users.nickname, users.isOnline, users.isDnd,onlyMentions FROM users \
    JOIN channel_users ON channel_users.user_id = users.id \
    JOIN channels on channel_users.channel_id = channels.id\
    WHERE channels.name = ? AND channel_users.isInvited = 0',
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
    if (privatePublic === 'Private') {
      privatny = true
    } else {
      privatny = false
    }

    let time = new Date().toISOString().slice(0, 19).replace('T', ' ')

    const channelExists = await Database.rawQuery('SELECT * from channels where name = ?', [
      channelName,
    ])

    if (channelExists.length > 0) {
    } else {
      await Database.rawQuery(
        'INSERT into channels(name, created_at, updated_at, private, creator_id) values(?, ?, ?, ?, ?)',
        [channelName, time, time, privatny, owner]
      )

      let channel = await Database.rawQuery('SELECT * from channels where name = ?', [channelName])

      await Database.rawQuery(
        'INSERT into channel_users(user_id, channel_id, created_at, updated_at, isInvited) values(?, ?, ?, ?, ?)',
        [owner, channel[0].id, time, time, false]
      )

      const channels = await Database.rawQuery(
        'SELECT channels.id, channels.name, channels.private, channels.creator_id, channels.updated_at, channel_users.isInvited FROM channels \
    JOIN channel_users ON channel_users.channel_id = channels.id \
    JOIN users on channel_users.user_id = users.id\
    WHERE  users.id = ? AND channels.name = ?',
        [owner, channelName]
      )

      return channels as SerializedChannel
    }
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
      await Database.rawQuery('delete from channel_users where channel_id = ? and user_id = ?', [
        channelId[0].id,
        user,
      ])
    }

    const channels = await this.getAll(user)

    return channels
  }

  public async modifySettings(
    owner: number,
    onlineOffline: string,
    DNB: string,
    notifications: string
  ): Promise<any> {
    let online
    if (onlineOffline === 'Online') {
      online = true
    } else {
      online = false
    }

    let DND
    if (DNB === 'On') {
      DND = true
    } else {
      DND = false
    }

    let onlyMentions
    if (notifications === 'On') {
      onlyMentions = true
    } else {
      onlyMentions = false
    }

    console.log(online, DND, onlyMentions, owner)
    const user = await Database.rawQuery(
      'update users set isOnline = ?, isDnd = ?, onlyMentions = ? where users.id = ?',
      [online, DND, onlyMentions, owner]
    )
    // console.log(await Database.rawQuery('select * from users where users.id = ?', [owner]))
    console.log('user', owner)
    const updatedUser = await Database.rawQuery('select * from users where users.id = ?', [owner])
    console.log('updatedUSER', updatedUser)
    return updatedUser
  }

  public async inviteUser(channelName: string, nickname: string): Promise<any> {
    const userID = await Database.rawQuery('select id from users where nickname = ?', [nickname])
    const channelID = await Database.rawQuery('select id from channels where name = ?', [
      channelName,
    ])

    if (userID.length === 0 || channelID.length === 0) {
      return 0
    }

    const check = await Database.rawQuery(
      'SELECT * FROM channel_users WHERE user_id = ? AND channel_id = ?',
      [userID[0].id, channelID[0].id]
    )

    if (check.length !== 0) {
      return 0
    }

    console.log(userID, channelID[0].id)
    await Database.rawQuery(
      'INSERT INTO channel_users (user_id, channel_id, created_at, updated_at, isInvited) VALUES (?,?,?,?,?)',
      [
        userID[0].id,
        channelID[0].id,
        new Date().toISOString().slice(0, 19).replace('T', ' '),
        new Date().toISOString().slice(0, 19).replace('T', ' '),
        1,
      ]
    )

    const channel = await Database.rawQuery(
      'SELECT channels.id, users.id, users.nickname, channels.name, channels.private, channels.creator_id, channels.updated_at, channel_users.isInvited FROM channels \
    JOIN channel_users ON channel_users.channel_id = channels.id \
    JOIN users on channel_users.user_id = users.id\
    WHERE channels.id = ? AND users.id = ?',
      [channelID[0].id, userID[0].id]
    )

    return [...channel]
  }

  public async inviteChoice(channelName: string, nickname: string, choice: boolean): Promise<any> {
    const userID = await Database.rawQuery('select id from users where nickname = ?', [nickname])
    const channelID = await Database.rawQuery('select id from channels where name = ?', [
      channelName,
    ])

    if (userID.length === 0 || channelID.length === 0) {
      return 0
    }

    if (choice) {
      await Database.rawQuery(
        'update channel_users set isInvited = ? where user_id = ? and channel_id = ?',
        [false, userID[0].id, channelID[0].id]
      )
    } else {
      await Database.rawQuery('delete from channel_users where user_id = ? and channel_id = ?', [
        userID[0].id,
        channelID[0].id,
      ])
    }

    console.log('BIG SELECT')
    const channels = await Database.rawQuery(
      'SELECT channels.id, channels.name, channels.private, channels.creator_id, channels.updated_at, channel_users.isInvited FROM channels \
    JOIN channel_users ON channel_users.channel_id = channels.id \
    JOIN users on channel_users.user_id = users.id\
    WHERE  users.id = ? ORDER BY channel_users.isInvited DESC',
      [userID[0].id]
    )

    return [...channels]
  }

  public async joinViaMessage(
    channelName: string,
    userID: number,
    privatePublic: string
  ): Promise<any> {
    // exsisting channel???
    const channelInfo = await Database.rawQuery(
      'select id, name, creator_id, private, created_at, updated_at from channels where name = ?',
      [channelName]
    )
    let privateNumber
    if (privatePublic === 'private') {
      privateNumber = 1
    } else {
      privateNumber = 0
    }

    console.log(channelInfo)
    let check
    if (channelInfo.length !== 0) {
      check = await Database.rawQuery(
        'select * from channel_users where user_id = ? and channel_id = ?',
        [userID, channelInfo[0].id]
      )
    }

    console.log('check1', check)
    if (check !== undefined) {
      console.log('check', check, check !== undefined)
      if (check.length !== 0) {
        return 0
      }
    }

    console.log('channel info length', channelInfo.length)
    // join existing channel
    if (channelInfo.length !== 0) {
      console.log('join existing channel', channelInfo, channelInfo.length)
      if (channelInfo[0].private === 1) {
        return 0
      } else if (privatePublic === 'public') {
        await Database.rawQuery(
          'INSERT INTO channel_users (user_id, channel_id, created_at, updated_at, isInvited) VALUES (?,?,?,?,?)',
          [
            userID,
            channelInfo[0].id,
            new Date().toISOString().slice(0, 19).replace('T', ' '),
            new Date().toISOString().slice(0, 19).replace('T', ' '),
            false,
          ]
        )

        const newChannel = await Database.rawQuery(
          'SELECT channels.id, users.id, users.nickname, channels.name, channels.private, channels.creator_id, channels.updated_at, channel_users.isInvited FROM channels \
    JOIN channel_users ON channel_users.channel_id = channels.id \
    JOIN users on channel_users.user_id = users.id\
    WHERE channels.name = ? AND users.id = ?',
          [channelName, userID]
        )

        return newChannel
      } else {
        return 0
      }
    }

    // create new channel
    else {
      console.log('create new channel')
      await Database.rawQuery(
        'INSERT INTO channels (name, private, creator_id, created_at, updated_at) VALUES (?,?,?,?,?)',
        [
          channelName,
          privateNumber,
          userID,
          new Date().toISOString().slice(0, 19).replace('T', ' '),
          new Date().toISOString().slice(0, 19).replace('T', ' '),
        ]
      )
      console.log('new channel created')
      const newChannelID = await Database.rawQuery('select id from channels where name = ?', [
        channelName,
      ])
      console.log('new channel id', newChannelID)

      await Database.rawQuery(
        'INSERT INTO channel_users (user_id, channel_id, created_at, updated_at, isInvited) VALUES (?,?,?,?,?)',
        [
          userID,
          newChannelID[0].id,
          new Date().toISOString().slice(0, 19).replace('T', ' '),
          new Date().toISOString().slice(0, 19).replace('T', ' '),
          false,
        ]
      )

      const newChannel = await Database.rawQuery(
        'SELECT channels.id, users.id, users.nickname, channels.name, channels.private, channels.creator_id, channels.updated_at, channel_users.isInvited FROM channels \
    JOIN channel_users ON channel_users.channel_id = channels.id \
    JOIN users on channel_users.user_id = users.id\
    WHERE channels.name = ? AND users.id = ?',
        [channelName, userID]
      )

      return newChannel
    }
  }

  public async revokeUser(channelName: string, nickname: string): Promise<any> {
    const userID = await Database.rawQuery('select id from users where nickname = ?', [nickname])
    const channelID = await Database.rawQuery('select id from channels where name = ?', [
      channelName,
    ])

    if (userID.length === 0 || channelID.length === 0) {
      return 0
    }

    await Database.rawQuery('delete from channel_users where user_id = ? and channel_id = ?', [
      userID[0].id,
      channelID[0].id,
    ])

    return 1
  }
}
