import type { GameObject } from '.'

export type WebSocketMessage = { id: string } & WebSocketEvents

export type WebSocketEvents
  = | WebSocketConnect
    | WebSocketConnected
    | WebSocketDisconnected

export interface WebSocketConnect {
  type: 'CONNECT'
  data: {
    id: string
    client: 'TELEGRAM_CLIENT' | 'SERVER'
    telegramId?: string
  }
}

export interface WebSocketConnected {
  type: 'CONNECTED'
  data: {
    id: string
    objects: GameObject[]
  }
}

export interface WebSocketDisconnected {
  type: 'DISCONNECTED'
  data: {
    id: string
  }
}
