<template>
  <div
    class="z-100 absolute inset-0 bg-gradient-to-br from-orange-400 to-violet-700"
    :class="[
      !gameStore.isLoading && 'transform -translate-x-full duration-500',
    ]"
  >
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/5">
      <div class="flex flex-col justify-center items-center gap-6 text-white">
        <div class="flex flex-col justify-center items-center">
          <p class="text-lg font-semibold">
            hmbanan666's
          </p>
          <p class="text-4xl font-semibold">
            Woodlands
          </p>
        </div>

        <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin opacity-40" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const gameStore = useGameStore()
</script>
