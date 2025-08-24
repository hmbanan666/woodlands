<template>
  <PageContainer>
    <h1>{{ t('app.top') }}</h1>
    <p>Id пользователя: {{ userStore.id }}</p>
  </PageContainer>
</template>

<script setup lang="ts">
const { t } = useI18n()
const userStore = useUserStore()
</script>
