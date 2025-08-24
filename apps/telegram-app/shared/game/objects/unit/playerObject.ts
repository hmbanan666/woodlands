import type { Game, GameObjectPlayer } from './../../types'
import { UnitObject } from './unitObject'

interface PlayerObjectOptions {
  game: Game
  id: string
  telegramId: string
  x: number
  y: number
}

export class PlayerObject extends UnitObject implements GameObjectPlayer {
  telegramId: string
  canClick: boolean
  nextClick: number

  constructor({ game, id, telegramId, x, y }: PlayerObjectOptions) {
    super({ game, id, x, y, type: 'PLAYER' })

    this.telegramId = telegramId
    this.speedPerSecond = 70
    this.canClick = true
    this.nextClick = 0
  }

  click(): void {
    this.canClick = false
    this.nextClick = 15
  }
}
