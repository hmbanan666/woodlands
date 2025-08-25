import type { Game } from '#shared/game/types'
import { BaseGame } from '#shared/game/baseGame'

const { public: publicEnv } = useRuntimeConfig()
const router = useRouter()

const instance = new BaseGame({ websocketUrl: publicEnv.websocketUrl })

export const useGameStore = defineStore('game', () => {
  const game = ref<Game>(instance)
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

  watch(router.currentRoute, () => {
    isOpened.value = router.currentRoute.value.name === 'index'
  }, { immediate: true })

  return {
    game,
    isOpened,
    isLoading,
    setAsLoaded,
  }
})
