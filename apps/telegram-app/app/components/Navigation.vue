<template>
  <nav class="bg z-50 touch-pan-x fixed bottom-0 left-0 right-0 w-full h-25 rounded-t-lg">
    <div class="max-w-[28rem] mx-auto">
      <div class="mt-3 grid grid-cols-4">
        <button
          v-for="route in mainRoutes"
          :key="route.path"
          class="flex flex-col items-center justify-center gap-1 px-4 cursor-pointer"
          :class="[
            router.currentRoute.value.path === route.path && 'button-active',
          ]"
          @click="handleClick(route.path)"
        >
          <div class="icon-block relative py-1 w-full rounded-2xl flex flex-row items-center justify-center">
            <UIcon :name="route.icon" class="size-6" />
          </div>
          <p class="text text-xs font-medium">
            {{ route.title }}
          </p>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { hapticFeedback } from '@telegram-apps/sdk-vue'

const { t } = useI18n()
const router = useRouter()

const mainRoutes = computed(() => [
  {
    path: '/',
    name: 'game',
    title: t('app.game'),
    icon: 'i-lucide-gamepad-2',
  },
  {
    path: '/quest',
    name: 'quests',
    title: t('app.quests'),
    icon: 'i-lucide-book-check',
  },
  {
    path: '/shop',
    name: 'shop',
    title: t('app.shop'),
    icon: 'i-lucide-shopping-bag',
  },
  {
    path: '/top',
    name: 'top',
    title: t('app.top'),
    icon: 'i-lucide-trophy',
  },
])

function handleClick(path: string) {
  if (hapticFeedback.impactOccurred.isAvailable()) {
    hapticFeedback.impactOccurred('light')
  }

  router.push(path)
}
</script>

<style scoped>
.bg {
  background-color: var(--tg-theme-bottom-bar-bg-color);
  border-top: 1px solid var(--tg-theme-section-separator-color);
}
button {
  color: var(--tg-theme-subtitle-text-color);
}
.button-active {
  .icon-block {
    background-color: var(--tg-theme-button-color);
    color: var(--tg-theme-button-text-color);
  }

  .text {
    color: var(--tg-theme-button-color);
  }
}
</style>
