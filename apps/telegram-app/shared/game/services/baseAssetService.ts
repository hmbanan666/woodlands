import type { AssetService, Game } from '../types/index'
import { Assets, Sprite } from 'pixi.js'

const trees = [
  { alias: 'TREE_1_GREEN', src: '/assets/objects/tree/1/green.png' },
  { alias: 'TREE_2_GREEN', src: '/assets/objects/tree/2/green.png' },
  { alias: 'TREE_3_GREEN', src: '/assets/objects/tree/3/green.png' },
  { alias: 'TREE_4_GREEN', src: '/assets/objects/tree/4/green.png' },
  { alias: 'TREE_5_GREEN', src: '/assets/objects/tree/5/green.png' },
  { alias: 'TREE_1_BLUE', src: '/assets/objects/tree/1/blue.png' },
  { alias: 'TREE_2_BLUE', src: '/assets/objects/tree/2/blue.png' },
  { alias: 'TREE_3_BLUE', src: '/assets/objects/tree/3/blue.png' },
  { alias: 'TREE_4_BLUE', src: '/assets/objects/tree/4/blue.png' },
  { alias: 'TREE_5_BLUE', src: '/assets/objects/tree/5/blue.png' },
  { alias: 'TREE_1_STONE', src: '/assets/objects/tree/1/stone.png' },
  { alias: 'TREE_2_STONE', src: '/assets/objects/tree/2/stone.png' },
  { alias: 'TREE_3_STONE', src: '/assets/objects/tree/3/stone.png' },
  { alias: 'TREE_4_STONE', src: '/assets/objects/tree/4/stone.png' },
  { alias: 'TREE_5_STONE', src: '/assets/objects/tree/5/stone.png' },
  { alias: 'TREE_1_TEAL', src: '/assets/objects/tree/1/teal.png' },
  { alias: 'TREE_2_TEAL', src: '/assets/objects/tree/2/teal.png' },
  { alias: 'TREE_3_TEAL', src: '/assets/objects/tree/3/teal.png' },
  { alias: 'TREE_4_TEAL', src: '/assets/objects/tree/4/teal.png' },
  { alias: 'TREE_5_TEAL', src: '/assets/objects/tree/5/teal.png' },
  { alias: 'TREE_1_TOXIC', src: '/assets/objects/tree/1/toxic.png' },
  { alias: 'TREE_2_TOXIC', src: '/assets/objects/tree/2/toxic.png' },
  { alias: 'TREE_3_TOXIC', src: '/assets/objects/tree/3/toxic.png' },
  { alias: 'TREE_4_TOXIC', src: '/assets/objects/tree/4/toxic.png' },
  { alias: 'TREE_5_TOXIC', src: '/assets/objects/tree/5/toxic.png' },
  { alias: 'TREE_1_VIOLET', src: '/assets/objects/tree/1/violet.png' },
  { alias: 'TREE_2_VIOLET', src: '/assets/objects/tree/2/violet.png' },
  { alias: 'TREE_3_VIOLET', src: '/assets/objects/tree/3/violet.png' },
  { alias: 'TREE_4_VIOLET', src: '/assets/objects/tree/4/violet.png' },
  { alias: 'TREE_5_VIOLET', src: '/assets/objects/tree/5/violet.png' },
]

const wagon = [
  { alias: 'WAGON_BASE_1', src: '/assets/objects/wagon/wagon-1.png' },
  { alias: 'WAGON_BASE_2', src: '/assets/objects/wagon/wagon-2.png' },
  { alias: 'WAGON_ENGINE', src: '/assets/objects/wagon/engine-1.png' },
  { alias: 'WAGON_WHEEL', src: '/assets/objects/wagon/wheel-1.png' },
  { alias: 'WAGON_ENGINE_CLOUD_1', src: '/assets/objects/wagon/clouds/1.png' },
  { alias: 'WAGON_ENGINE_CLOUD_2', src: '/assets/objects/wagon/clouds/2.png' },
  { alias: 'WAGON_ENGINE_CLOUD_3', src: '/assets/objects/wagon/clouds/3.png' },
  { alias: 'WAGON_ENGINE_CLOUD_4', src: '/assets/objects/wagon/clouds/4.png' },
]

export class BaseAssetService implements AssetService {
  constructor(protected game: Game) {}

  sprite(alias: string) {
    return Sprite.from(alias)
  }

  async load() {
    await Assets.load(trees)
    await Assets.load(wagon)
  }
}
