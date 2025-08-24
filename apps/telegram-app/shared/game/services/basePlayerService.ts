import type { CharacterEditionWithCharacter, Game, GameObjectPlayer, PlayerService } from '../types'
import { FlagObject } from '../objects/flagObject'
import { PlayerObject } from '../objects/unit/playerObject'

export class BasePlayerService implements PlayerService {
  constructor(readonly game: Game) {}

  update() {
    // Debounce
    if (this.game.player?.canClick === false) {
      this.game.player.nextClick -= 1

      if (this.game.player.nextClick <= 0) {
        this.game.player.canClick = true
      }
    }
  }

  get activePlayers() {
    return this.game.children.filter(
      (obj) => obj.type === 'PLAYER',
    ) as GameObjectPlayer[]
  }

  async findOrCreatePlayer(
    id: string,
    telegramId: string,
    character?: CharacterEditionWithCharacter,
  ): Promise<GameObjectPlayer> {
    const player = this.findPlayer(id)
    if (!player) {
      return this.createPlayer({ id, telegramId, character, x: 0 })
    }

    return player
  }

  findPlayer(id: string) {
    return this.game.children.find((p) => p.id === id && p.type === 'PLAYER') as PlayerObject | undefined
  }

  async createPlayer({ id, telegramId, x, character }: { id: string, telegramId: string, x: number, character?: CharacterEditionWithCharacter }) {
    const player = new PlayerObject({
      game: this.game,
      id,
      telegramId,
      x,
      y: this.game.bottomY,
    })
    await player.initVisual(character?.character.codename)

    return player
  }

  removePlayer(id: string) {
    const player = this.findPlayer(id)
    if (player) {
      player.state = 'DESTROYED'
    }
  }

  movePlayer({ id, x }: { id: string, x: number }) {
    const player = this.findPlayer(id)
    if (player) {
      const flag = new FlagObject({ game: this.game, x, y: this.game.bottomY, variant: 'PLAYER_MOVEMENT' })
      if (player.target && player.target.type === 'FLAG') {
        const flag = player.target
        player.target = undefined
        flag.state = 'DESTROYED'
      }
      player.target = flag
    }

    return player
  }
}
