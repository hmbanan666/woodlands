<template>
  <div
    class="absolute inset-0 overflow-hidden select-none bg-orange-200"
    :class="[
      !gameStore.isOpened && 'hidden',
    ]"
  >
    <div ref="canvas" class="absolute w-full h-full bottom-10" />
    <div class="absolute w-full h-35 bottom-0 bg-red-950" />

    <div class="touch-pan-x mt-2 w-full h-16 tg-safe-area">
      <div class="max-w-[28rem] mx-auto px-4 space-y-2 tg-content-safe-area">
        <!-- <GameNavigator :player-x="game.player?.x" :wagon-x="game.wagon?.x" />
        <GameCharacterProgression /> -->

        <!-- <div v-if="profile && profile.energy >= 0" class="hidden w-fit h-10 px-5 py-0 flex-row items-center gap-2 bg-orange-100/80 text-amber-600 rounded-full">
          <p class="text-xl font-semibold leading-none tracking-tight">
            {{ profile?.energy }}
          </p>
        </div> -->

        <div class="flex flex-row items-center gap-2">
          <div class="text-primary">
            <UIcon
              v-if="gameStore.game.websocketService.socket.status === 'CONNECTING'"
              name="i-lucide-wifi-sync"
              class="size-6 opacity-40"
            />
            <UIcon
              v-if="gameStore.game.websocketService.socket.status === 'OPEN'"
              name="i-lucide-wifi"
              class="size-6"
            />
          </div>

          <div class="flex flex-col text-primary text-xs font-medium">
            <p>x{{ playerX }}</p>
            <p>y{{ playerY }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Modal
    :title="t('app.welcome.title')"
    :is-opened="isHelpModalOpened"
    @close="isHelpModalOpened = false"
  >
    <p class="leading-tight">
      {{ t('app.welcome.description') }}
    </p>
    <p class="tg-text-hint leading-tight">
      {{ t('app.welcome.hint') }}
    </p>
  </Modal>

  <GameLoader />
</template>

<script setup lang="ts">
import { hapticFeedback } from '@telegram-apps/sdk-vue'

const { t } = useI18n()

const userStore = useUserStore()
const gameStore = useGameStore()

const playerX = ref(0)
const playerY = ref(0)

watch(
  () => gameStore.game.player,
  () => {
    playerX.value = Math.floor(gameStore.game.player?.x ?? 0)
    playerY.value = Math.floor(gameStore.game.player?.y ?? 0)
  },
  { deep: true },
)

const canvas = ref<HTMLElement>()
const isHelpModalOpened = ref(true)

onMounted(async () => {
  if (!userStore.initDataState?.user?.id) {
    return
  }

  gameStore.isLoading = true

  // Init
  await gameStore.game.init(userStore.initDataState.user.id.toString())
  canvas.value?.appendChild(gameStore.game.app.canvas)

  gameStore.setAsLoaded()

  gameStore.game.openLoader = () => {
    gameStore.isLoading = true
  }

  gameStore.game.updateUI = async () => {
    // await refreshCharacter()
    gameStore.setAsLoaded()
  }

  gameStore.game.vibrate = () => {
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred('light')
    }
  }
})

onUnmounted(() => {
  canvas.value?.removeChild(gameStore.game.app.canvas)
  gameStore.game.destroy()
})
</script>
