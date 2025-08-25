import type { Game } from '#shared/game/types'
import { BaseGame } from '#shared/game/baseGame'

// Only one instance
let instance: Game | null = null

function _useGameClient() {
  const { public: publicEnv } = useRuntimeConfig()
  const router = useRouter()

  const isOpened = ref(false)
  const isLoading = ref(false)

  const game = ref<Game>(useGame())

  function useGame() {
    if (!instance) {
      instance = new BaseGame({ websocketUrl: publicEnv.websocketUrl })
      return instance
    }

    return instance
  }

  function setAsLoaded() {
    try {
      setTimeout(() => {
        isLoading.value = false
      }, 1500)
    } catch (error) {
      console.error('Error in setAsLoaded:', error)
    }
  }

  watch(router.currentRoute, () => {
    isOpened.value = router.currentRoute.value.name === 'index'
  }, { immediate: true })

  return {
    game,
    isLoading,
    isOpened,
    setAsLoaded,
  }
}

export const useGameClient = createSharedComposable(_useGameClient)
