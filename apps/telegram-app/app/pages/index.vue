<template>
  <div class="p-4">
    <h1>Привет, {{ userStore.name }}!</h1>
    <p>Id пользователя: {{ userStore.id }}</p>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
</script>
