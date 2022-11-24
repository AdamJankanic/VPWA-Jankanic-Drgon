import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, BelongsTo, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Message from 'App/Models/Message'
import User from 'App/Models/User'

export default class Channel extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public private: boolean

  @column()
  public creatorId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Message, {
    foreignKey: 'channelId',
  })
  public messages: HasMany<typeof Message>
  // public creator: HasOne<typeof User>
  public clen: BelongsTo<typeof User>
}
