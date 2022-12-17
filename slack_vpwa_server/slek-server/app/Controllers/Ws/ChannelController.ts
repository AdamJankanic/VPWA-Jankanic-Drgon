/* eslint-disable prettier/prettier */
import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'
import type { ChannelRepositoryContract } from '@ioc:Repositories/ChannelRepository'
import { inject } from '@adonisjs/core/build/standalone'
import Database from '@ioc:Adonis/Lucid/Database'

@inject(['Repositories/ChannelRepository'])
export default class ChannelController {
  constructor(private channelRepository: ChannelRepositoryContract) {}

  public async loadChannels({ params }: WsContextContract, userId: number) {
    // console.log(this.channelRepository)
    let result = await this.channelRepository.getAll(userId)

    return result
  }

  //load users in channel
  public async loadUsers({ params }: WsContextContract, channelName: string) {
    return await this.channelRepository.getUsers(channelName)
  }

  public async addChannel(
    { params }: WsContextContract,
    owner: number,
    channelName: string,
    privatePublic: string
  ) {
    return await this.channelRepository.create(owner, channelName, privatePublic)
  }

  public async leaveChannel(
    { params, socket }: WsContextContract,
    channelName: string,
    user: number
  ) {
    const creatorId = await Database.rawQuery('select creator_id from channels where name = ?', [
      channelName,
    ])
    const channels = await this.channelRepository.leaveChannel(channelName, user)

    console.log('leaveChannelController   ', creatorId[0].creator_id)
    if (creatorId[0].creator_id === user) {
      socket.broadcast.emit('leaveChannelResponse', channelName)
    }
    return channels
  }

  public async modifySettings(
    { params }: WsContextContract,
    owner: number,
    onlineOffline: string,
    DNB: string,
    notifications: string
  ) {
    return await this.channelRepository.modifySettings(owner, onlineOffline, DNB, notifications)
  }

  public async inviteUser(
    { params, socket }: WsContextContract,
    channelName: string,
    nickname: string
  ) {
    console.log('inviteUserController', channelName, nickname)
    const channel = await this.channelRepository.inviteUser(channelName, nickname)
    if (channel === 0) {
      return 0
    }

    console.log(channel)
    socket.broadcast.emit('inviteUserResponse', channelName, nickname, channel)
    return 1
  }

  public async inviteChoice(
    { params, socket }: WsContextContract,
    channelName: string,
    nickname: string,
    choice: boolean
  ) {
    console.log('inviteChoiceController', channelName, nickname, choice)
    const channels = await this.channelRepository.inviteChoice(channelName, nickname, choice)

    return channels
  }
}
