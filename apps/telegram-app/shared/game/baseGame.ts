import type {
  Game,
  GameObject,
  GameObjectPlayer,
  GameObjectWagon,
  PlayerService,
  TreeService,
  WebSocketService,
} from './types/index'
import { createId } from '@paralleldrive/cuid2'
import { Application, Container, Rectangle, TextureStyle } from 'pixi.js'
import { BaseWagonObject } from './objects/baseWagonObject'
import { FlagObject } from './objects/flagObject'
import { MoveToFlagScript } from './scripts/moveToFlagScript'
import { BaseAssetService } from './services/baseAssetService'
import { BasePlayerService } from './services/basePlayerService'
import { BaseTreeService } from './services/baseTreeService'
import { BaseWebSocketService } from './services/baseWebSocketService'

interface BaseGameOptions {
  websocketUrl: string
}

export class BaseGame extends Container implements Game {
  id: string
  override children: Game['children'] = []
  app: Application
  tick: Game['tick'] = 0

  updateUI: () => void
  openLoader: () => void
  vibrate: () => void

  wagon: GameObjectWagon | null = null
  player: GameObjectPlayer | null = null

  assetService: BaseAssetService
  playerService: PlayerService
  treeService: TreeService
  websocketService: WebSocketService

  rectangle!: Rectangle
  bottomY = 0
  leftX = 0
  cameraTarget: GameObjectWagon | GameObjectPlayer | null = null
  cameraOffsetX = 0
  cameraMovementSpeedX = 0.008
  cameraOffsetY = 0
  cameraMovementSpeedY = 0.008
  cameraX = 0
  cameraY = 0
  cameraPerfectX = 0
  cameraPerfectY = 0

  baseAppTicker = () => {
    this.tick = this.app.ticker.FPS

    this.playerService.update()
    this.treeService.update()
    this.updateObjects()

    if (this.cameraTarget) {
      this.leftX = this.cameraTarget.x
      this.rectangle.x = this.cameraTarget.x - this.app.screen.width / 2

      this.changeCameraPosition(this.cameraTarget.x)
      this.moveCamera()
    }
  }

  constructor({ websocketUrl }: BaseGameOptions) {
    super()

    this.id = createId()
    this.app = new Application()

    this.updateUI = () => {}
    this.openLoader = () => {}
    this.vibrate = () => {}

    this.assetService = new BaseAssetService(this)
    this.playerService = new BasePlayerService(this)
    this.treeService = new BaseTreeService(this)
    this.websocketService = new BaseWebSocketService(this, websocketUrl)
  }

  async init(telegramId: string) {
    await this.app.init({
      backgroundAlpha: 0,
      antialias: false,
      roundPixels: false,
      resolution: 2,
      autoDensity: true,
      resizeTo: window,
    })

    await this.assetService.load()

    TextureStyle.defaultOptions.scaleMode = 'nearest'
    this.app.ticker.maxFPS = 60
    this.bottomY = this.app.screen.height - 100

    this.app.stage.eventMode = 'static'
    this.app.screen.width = window.innerWidth
    this.app.screen.height = window.innerHeight
    this.rectangle = new Rectangle(0, 0, this.app.screen.width, this.app.screen.height)
    this.app.stage.hitArea = this.rectangle

    this.app.stage.addChild(this)

    await this.initPlayer(telegramId)

    this.websocketService.connect(telegramId)

    this.app.ticker.add(this.baseAppTicker, 'baseAppTicker')
  }

  async initPlayer(telegramId: string) {
    this.player = await this.playerService.createPlayer({ id: createId(), telegramId, x: 200 })
    this.cameraTarget = this.player

    this.app.stage.addEventListener('pointerdown', (e) => {
      if (!this.player?.canClick) {
        return
      }

      const isTargetAnObject = e.target.children.length === 0
      if (isTargetAnObject) {
        return
      }

      const middle = this.app.screen.width / 2
      const offsetX = e.clientX - middle
      const serverX = offsetX + this.leftX

      const flag = new FlagObject({ game: this, x: serverX, y: this.bottomY, variant: 'PLAYER_MOVEMENT' })
      if (this.player.target && this.player.target.type === 'FLAG') {
        const flag = this.player.target
        this.player.target = undefined
        flag.state = 'DESTROYED'
      }
      this.player.target = flag

      this.player.click()

      // this.websocketService.send({
      //   type: 'NEW_PLAYER_TARGET',
      //   data: {
      //     x: serverX,
      //     id: this.player.id,
      //   },
      // })
    })
  }

  createObject(data: { type: GameObject['type'], id: string, x: number, zIndex?: number }) {
    // Check, if already exists
    if (this.findObject(data.id)) {
      return
    }

    if (data.type === 'WAGON' && !this.wagon) {
      this.wagon = new BaseWagonObject({ game: this, x: data.x, y: this.bottomY })
      this.app.stage.addChild(this.wagon)
      this.addChild(this.wagon)
    }
  }

  removeObject(id: string) {
    const obj = this.findObject(id)
    if (!obj) {
      return
    }

    if (obj.type === 'TREE') {
      this.updateUI()
    }

    const index = this.children.indexOf(obj)
    this.children.splice(index, 1)

    this.removeChild(obj)
  }

  override destroy() {
    this.app.destroy()
    super.destroy()
  }

  checkIfThisFlagIsTarget(id: string): boolean {
    for (const obj of this.children) {
      if (obj.target?.id === id) {
        return true
      }
    }
    return false
  }

  findObject(id: string): GameObject | undefined {
    return this.children.find((obj) => obj.id === id)
  }

  rebuildScene() {
    this.openLoader()

    for (const obj of this.children) {
      if (obj.type === 'PLAYER' && obj.id === this.player?.id) {
        continue
      }

      obj.state = 'DESTROYED'
    }

    this.wagon = null

    this.app.ticker.remove(this.baseAppTicker, 'baseAppTicker')
    this.app.ticker.add(this.baseAppTicker, 'baseAppTicker')
  }

  updateObjects() {
    for (const object of this.children) {
      if (object.state === 'DESTROYED') {
        this.removeObject(object.id)
      }

      object.animate()
      object.live()

      if (object.type === 'PLAYER') {
        this.updatePlayer(object as GameObjectPlayer)
      }
    }
  }

  updatePlayer(object: GameObjectPlayer) {
    if (object.script) {
      return
    }

    if (object.target && object.target.type === 'FLAG') {
      object.script = new MoveToFlagScript({
        object,
        target: object.target,
      })
    }
  }

  changeCameraPosition(x: number) {
    const columnWidth = this.app.screen.width / 4
    const leftPadding = 2

    this.cameraPerfectX = -x + columnWidth * leftPadding

    // If first load
    if (Math.abs(-x - this.cameraX) > 300) {
      this.cameraX = this.cameraPerfectX
    }
  }

  moveCamera() {
    const cameraMaxSpeed = 20
    const bufferX = Math.abs(this.cameraPerfectX - this.cameraX)
    const moduleX = this.cameraPerfectX - this.cameraX > 0 ? 1 : -1
    const addToX = bufferX > cameraMaxSpeed ? cameraMaxSpeed : bufferX

    if (this.cameraX !== this.cameraPerfectX) {
      this.cameraX += addToX * moduleX
    }

    if (this.parent) {
      this.parent.x = this.cameraX
    }
  }
}
