import type { WebSocketConnect, WebSocketEvents, WebSocketMessage } from '#shared/game/types/websocket'
import type { Peer } from 'crossws'
import { createId } from '@paralleldrive/cuid2'
import { activeRooms } from './room'

export const logger = useLogger('ws')

export function sendMessage(message: WebSocketEvents, roomId: string) {
  const room = activeRooms.find((room) => room.id === roomId)
  if (!room?.server.peer?.id) {
    return
  }

  const preparedMessage = JSON.stringify({ id: createId(), ...message })
  room.server.peer.publish(room.id, preparedMessage)
}

export async function handleMessage(message: WebSocketMessage, peer: Peer) {
  switch (message.type) {
    case 'CONNECT':
      return handleConnect(message, peer)
    // case 'DESTROY_TREE':
    //   return handleDestroyTree(message, peer)
    // case 'NEW_PLAYER_TARGET':
    //   return handleNewPlayerTarget(message, peer)
  }
}

export function handleClose(peer: Peer) {
  const room = activeRooms.find((room) => room.clients.find((c) => c.peerId === peer.id))
  if (!room) {
    return
  }

  // if player - remove from objects
  // const player = room.clients.find((c) => c.peerId === peer.id)
  // if (!player) {
  //   return
  // }

  // const playerObject = room.objects.find((obj) => obj.type === 'PLAYER' && obj.id === player.id)
  // if (playerObject) {
  //   room.removeObject(playerObject.id)
  // }

  // sendMessage({ type: 'DISCONNECTED_FROM_WAGON_ROOM', data: { id: player.id } }, room.id)

  room.clients = room.clients.filter((c) => c.peerId !== peer.id)
}

async function handleConnect(message: WebSocketConnect, peer: Peer) {
  switch (message.data.client) {
    case 'TELEGRAM_CLIENT':
      return handleConnectTelegramClient(message, peer)
    case 'SERVER':
      return handleConnectServer(peer, message.data.id)
  }
}

async function handleConnectTelegramClient(message: WebSocketConnect, peer: Peer) {
  if (!message.data.telegramId) {
    return
  }

  const activeRoom = activeRooms.find((room) => room.id === message.data.id)
  if (!activeRoom) {
    return
  }

  // add to objects
  // const wagon = activeRoom.objects.find((obj) => obj.type === 'WAGON')
  // const telegramProfile = await prisma.telegramProfile.findFirst({
  //   where: { telegramId: message.data.telegramId },
  //   include: {
  //     profile: true,
  //   },
  // })
  // const activeEditionId = telegramProfile?.profile?.activeEditionId
  // const character = await prisma.characterEdition.findFirst({
  //   where: { id: activeEditionId },
  //   include: { character: true },
  // }) as CharacterEditionWithCharacter | null
  // if (!character) {
  //   return
  // }

  // Check, if already exists by Telegram
  // const playerExist = activeRoom.objects.find((obj) => obj.type === 'PLAYER' && obj.telegramId === message.data.telegramId)
  // if (playerExist) {
  //   return
  // }

  // const playerId = createId()

  // if (!activeRoom.clients.find((c) => c.peerId === peer.id)) {
  //   activeRoom.clients.push({ id: playerId, peerId: peer.id })
  // }

  // activeRoom.addPlayer({ id: playerId, telegramId: message.data.telegramId, x: wagon?.x ? wagon.x - 200 : 100, character })

  // peer.subscribe(activeRoom.id)
  // sendMessage({ type: 'CONNECTED_TO_WAGON_ROOM', data: { type: 'PLAYER', roomId: activeRoom.id, id: playerId, objects: activeRoom.objects } }, activeRoom.id)

  logger.log(`Telegram client ${message.data.telegramId} subscribed to Room ${activeRoom.id}`, peer.id)
}

async function handleConnectServer(peer: Peer, id: string) {
  const activeRoom = activeRooms.find((room) => room.id === id)
  if (!activeRoom) {
    return
  }

  activeRoom.server.peer = peer
  peer.subscribe(activeRoom.id)
  logger.log(`Server subscribed to Room ${activeRoom.id}`, peer.id)
}
