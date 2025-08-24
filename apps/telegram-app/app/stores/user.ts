import { initDataRaw as _initDataRaw, initDataState as _initDataState, useSignal } from '@telegram-apps/sdk-vue'

export const useUserStore = defineStore('user', () => {
  const id = ref<string | undefined>(undefined)
  const name = ref<string | undefined>(undefined)

  const initDataRaw = useSignal(_initDataRaw)
  const initDataState = useSignal(_initDataState)

  async function update() {
    try {
      const data = await $fetch('/api/auth/me', {
        headers: {
          Authorization: `tma ${initDataRaw.value}`,
        },
      })
      if (!data) {
        return
      }

      id.value = data.id
      name.value = data.name
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          // No session
        }
        if (error.message.includes('404')) {
          // Not found
        }
      }
    }
  }

  return {
    id,
    name,

    initDataRaw,
    initDataState,

    update,
  }
})
