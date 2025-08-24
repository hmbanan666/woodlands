import type { WebSocketMessage } from '@woodlands/game'
import { handleClose, handleMessage, logger } from '../services/websocket'

export default defineWebSocketHandler({
  open(peer): void {
    logger.log('open', peer.id)
  },

  async message(peer, message): Promise<void> {
    const text = message.text()
    if (!text) {
      return
    }

    if (text.includes('ping')) {
      peer.send('pong')
      return
    }

    const parsed = JSON.parse(text)
    if (!parsed?.id || !parsed?.type) {
      return
    }

    return handleMessage(parsed as WebSocketMessage, peer)
  },

  close(peer, event): void {
    logger.log('close', peer.id, JSON.stringify(event))
    return handleClose(peer)
  },

  error(peer, error): void {
    logger.error('error', peer.id, JSON.stringify(error))
  },
})
