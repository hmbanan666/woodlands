import type { Game } from '#shared/game/types'
import { BaseGame } from '#shared/game/baseGame'

// Only one instance
let instance: Game | null = null

export function useGame() {
  if (!instance) {
    const websocketUrl = 'wss://woodlands.chatgame.space/api/websocket'
    instance = new BaseGame({ websocketUrl })
    return instance
  }

  return instance
}

function _useGameClient() {
  const router = useRouter()

  const isOpened = ref(false)
  const isLoading = ref(false)

  function setAsLoaded() {
    try {
      setTimeout(() => {
        isLoading.value = false
      }, 1500)
    } catch (error) {
      console.error('Error in setAsLoaded:', error)
    }
  }

  watch(router.currentRoute, (value) => {
    isOpened.value = value.path === '/'
  })

  return {
    game: useGame(),
    isLoading,
    isOpened,
    setAsLoaded,
  }
}

export const useGameClient = createSharedComposable(_useGameClient)
