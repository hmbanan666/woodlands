import type { Game, WebSocketService } from '../types'
import type { WebSocketConnect, WebSocketConnected, WebSocketDisconnected, WebSocketEvents, WebSocketMessage } from '../types/websocket'
import { createId } from '@paralleldrive/cuid2'
import { useWebSocket } from '@vueuse/core'

export class BaseWebSocketService implements WebSocketService {
  socket: WebSocketService['socket']

  constructor(readonly game: Game, readonly websocketUrl: string) {
    this.socket = useWebSocket(this.websocketUrl, {
      autoReconnect: true,
      heartbeat: {
        message: 'ping',
        interval: 10000,
        pongTimeout: 10000,
      },
      onMessage: (_, event) => {
        if (event.data.toString() === 'pong') {
          return
        }

        const message = this.parse(event.data.toString())
        if (!message) {
          return
        }

        this.handleMessage(message)
      },
    })
  }

  connect(telegramId: string) {
    this.socket.open()

    const connectMessage: WebSocketConnect = {
      type: 'CONNECT',
      data: {
        id: this.game.id,
        client: 'TELEGRAM_CLIENT',
        telegramId,
      },
    }
    this.send(connectMessage)
  }

  send(event: WebSocketEvents) {
    const preparedMessage = JSON.stringify({ ...event, id: createId() })
    this.socket.send(preparedMessage)
  }

  async handleMessage(message: WebSocketMessage) {
    switch (message.type) {
      case 'CONNECTED':
        return this.handleConnect(message)
      case 'DISCONNECTED':
        return this.handleDisconnect(message)
      // case 'NEW_PLAYER_TARGET':
      //   return this.handleNewPlayerTarget(message)
      // case 'NEW_WAGON_TARGET':
      //   return this.handleNewWagonTarget(message)
      // case 'DESTROY_TREE':
      //   return this.handleDestroyTree(message)
    }
  }

  async handleConnect(message: WebSocketConnected) {
    const { objects } = message.data

    // Init all objects
    for (const obj of objects) {
      if (this.game.findObject(obj.id)) {
        continue
      }

      // if (obj.type === 'PLAYER') {
      //   if (obj?.telegramId !== this.game.player?.telegramId) {
      //     await this.game.playerService.createPlayer({ id: obj.id, telegramId: obj.telegramId, x: obj.x, character: obj.character })
      //   }
      // } else if (obj.type === 'TREE') {
      //   this.game.treeService.create({ id: obj.id, x: obj.x, zIndex: obj.zIndex, treeType: obj.treeType, variant: obj.variant, size: obj.size, maxSize: obj.maxSize })
      // } else {
      //   this.game.createObject({ type: obj.type, id: obj.id, x: obj.x, zIndex: obj?.zIndex })
      // }
    }

    // if (type === 'PLAYER' && this.game.player) {
    //   await this.initPlayer(objects, id)
    // }
  }

  // async initPlayer(objects: GameObject[], id: string) {
  //   const player = objects.find((obj) => obj.type === 'PLAYER' && obj.id === id)
  //   // Me?
  //   if (player && player?.telegramId === this.game.player?.telegramId) {
  //     this.game.player.id = id
  //     this.game.player.x = player.x
  //     await this.game.player.initVisual(player.character.character.codename)

  //     // Close loader
  //     this.game.updateUI()
  //   }
  // }

  handleDisconnect(message: WebSocketDisconnected) {
    this.game.playerService.removePlayer(message.data.id)
  }

  // handleNewPlayerTarget(message: WebSocketNewPlayerTarget) {
  //   const { id, x } = message.data

  //   if (this.addon.client === 'TELEGRAM_CLIENT') {
  //     if (this.addon.player?.id !== id) {
  //       this.addon.playerService.movePlayer({ id, x })
  //     }
  //   }

  //   if (this.addon.client === 'WAGON_CLIENT') {
  //     this.addon.playerService.movePlayer({ id, x })
  //   }
  // }

  // handleNewWagonTarget(message: WebSocketNewWagonTarget) {
  //   this.addon.wagon?.createFlagAndMove(message.data.x)
  // }

  // handleDestroyTree(message: WebSocketDestroyTree) {
  //   this.addon.removeObject(message.data.id)
  // }

  parse(message: string): WebSocketMessage | undefined {
    try {
      const parsed = JSON.parse(message)
      return parsed?.id ? parsed as WebSocketMessage : undefined
    } catch (e) {
      console.error(e)
      return undefined
    }
  }
}
