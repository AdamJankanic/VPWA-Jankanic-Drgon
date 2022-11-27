/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable prettier/prettier */
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'

export default class UserController {
  async modifySettings({ request }: HttpContextContract) {
    let online
    if (request.body().onlineOffline === 'Online') {
      online = true
    } else {
      online = false
    }

    let DND
    if (request.body().DNB === 'On') {
      DND = true
    } else {
      DND = false
    }

    let onlyMentions
    if (request.body().notifications === 'On') {
      onlyMentions = true
    } else {
      onlyMentions = false
    }

    await Database.rawQuery(
      'update users set isOnline = ?, isDnd = ?, onlyMentions = ? where users.id = ?',
      [online, DND, onlyMentions, request.body().owner]
    )

    return await Database.rawQuery('select * from users where users.id = ?', [request.body().owner])
  }

  async loadUser({ request }: HttpContextContract) {
    // console.log('dasdsad', request.body());

    return Database.rawQuery('select * from users where users.id = ?', [request.body().userId])
  }
}
