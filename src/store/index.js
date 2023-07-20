import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStoreStore = defineStore('store', () => {
  const count = ref(0)
  function increment () {
    count.value++
  }

  const theme = ref('chalk')
  const changeTheme = () => {
    theme.value = theme.value === 'chalk' ? 'vintage' : 'chalk'
  }

  return {
    count,
    increment,
    theme,
    changeTheme
  }
})
