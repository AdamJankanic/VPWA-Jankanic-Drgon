/* eslint-disable prettier/prettier */
/*
|--------------------------------------------------------------------------
| Websocket events
|--------------------------------------------------------------------------
|
| This file is dedicated for defining websocket namespaces and event handlers.
|
*/

import Ws from '@ioc:Ruby184/Socket.IO/Ws'
import ChannelController from 'App/Controllers/Ws/ChannelController'

Ws.namespace('/')
  .connected('ActivityController.onConnected')
  .disconnected('ActivityController.onDisconnected')

// this is dynamic namespace, in controller methods we can use params.name
Ws.namespace('channels/:name')
  // .middleware('channel') // check if user can join given channel
  .on('loadMessages', 'MessageController.loadMessages')
  .on('addMessage', 'MessageController.addMessage')
  .on('loadMoreMessages', 'MessageController.loadMoreMessages')
  .on('loadChannels', 'ChannelController.loadChannels')
  .on('loadUsers', 'ChannelController.loadUsers')
  .on('addChannel', 'ChannelController.addChannel')
  .on('leaveChannel', 'ChannelController.leaveChannel')
  .on('modifySettings', 'ChannelController.modifySettings')
  .on('inviteUser', 'ChannelController.inviteUser')
  .on('inviteChoice', 'ChannelController.inviteChoice')
  .on('joinViaMessage', 'ChannelController.joinViaMessage')
  .on('revokeUser', 'ChannelController.revokeUser')
