import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
  HasOne,
  belongsTo,
  BelongsTo,
} from '@ioc:Adonis/Lucid/Orm'
import Channel from 'App/Models/Channel'
import Message from 'App/Models/Message'

export default class User extends BaseModel {
  public serializeExtras = true

  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column()
  public nickname: string

  @column()
  public isOnline: boolean

  @column()
  public isDnd: boolean

  @column()
  public onlyMentions: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Message, {
    foreignKey: 'createdBy',
  })
  public sentMessages: HasMany<typeof Message>

  @manyToMany(() => Channel, {
    pivotTable: 'channel_users',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'channel_id',
    pivotTimestamps: true,
  })
  public channels: ManyToMany<typeof Channel>

  //belongsTo channel creator
  @belongsTo(() => Channel, { foreignKey: 'id' })
  public creatotId: BelongsTo<typeof Channel>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
