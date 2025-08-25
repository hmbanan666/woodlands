<template>
  <div
    class="absolute inset-0 overflow-hidden select-none bg-orange-200"
    :class="[
      !client.isOpened.value && 'hidden',
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

        <div class="relative text-primary">
          <UIcon
            v-if="client.game.value.websocketService.socket.status === 'CONNECTING'"
            name="i-lucide-wifi-sync"
            class="size-6 opacity-40"
          />
          <UIcon
            v-if="client.game.value.websocketService.socket.status === 'OPEN'"
            name="i-lucide-wifi"
            class="size-6"
          />
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

const client = useGameClient()

const canvas = ref<HTMLElement>()
const isHelpModalOpened = ref(true)

onMounted(async () => {
  if (!userStore.initDataState?.user?.id) {
    return
  }

  client.isLoading.value = true

  // Init
  await client.game.value.init(userStore.initDataState.user.id.toString())
  canvas.value?.appendChild(client.game.value.app.canvas)

  client.setAsLoaded()

  client.game.value.openLoader = () => {
    client.isLoading.value = true
  }

  client.game.value.updateUI = async () => {
    // await refreshCharacter()
    client.setAsLoaded()
  }

  client.game.value.vibrate = () => {
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred('light')
    }
  }
})

onUnmounted(() => {
  canvas.value?.removeChild(client.game.value.app.canvas)
  client.game.value.destroy()
})
</script>
