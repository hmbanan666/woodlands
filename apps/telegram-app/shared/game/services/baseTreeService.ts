import type { Game, GameObjectTree, TreeService } from '../types'
import { TreeObject } from '../objects/treeObject'

export class BaseTreeService implements TreeService {
  treesPerfectAmount = 180

  constructor(readonly game: Game) {}

  create(data: {
    id: string
    x: number
    zIndex: number
    treeType: GameObjectTree['treeType']
    variant: GameObjectTree['variant']
    size: number
    maxSize: number
  }) {
    return new TreeObject({ id: data.id, game: this.game, x: data.x, y: this.game.bottomY + 2, size: data.size, maxSize: data.maxSize, zIndex: data.zIndex, treeType: data.treeType, variant: data.variant })
  }

  update() {
    // Nothing
  }

  getNearestObstacle(x: number): TreeObject | undefined {
    // Only on right side + isObstacle
    const trees = this.game.children
      .filter((obj) => obj.type === 'TREE' && obj.x > x) as TreeObject[]

    return trees.filter((obj) => obj.isAnObstacleToWagon)
      .sort((a, b) => a.x - b.x)[0]
  }
}
