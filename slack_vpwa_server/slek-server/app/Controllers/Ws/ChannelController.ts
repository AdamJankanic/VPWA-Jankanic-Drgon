/* eslint-disable prettier/prettier */
import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'
import type { ChannelRepositoryContract } from '@ioc:Repositories/ChannelRepository'
import { inject } from '@adonisjs/core/build/standalone'

@inject(['Repositories/ChannelRepository'])
export default class ChannelController {
  constructor(private channelRepository: ChannelRepositoryContract) {}

  public async loadChannels({ params }: WsContextContract, userId: number) {
    // console.log(this.channelRepository)
    console.log('AAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHHHHOOOOOOOOOOOOOOJJJJJJJJJJJJJJ')
    let result = await this.channelRepository.getAll(userId)

    console.log('vonku z query')
    console.log(result)

    return result
  }
}
