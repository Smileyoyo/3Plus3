<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  // Check if user is already logged in
  if (authStore.isLoggedIn) {
    authStore.fetchUserInfo()
  }
})
</script>

<template>
  <router-view />
</template>

<style lang="scss">
@import './styles/globals.css';
@import './styles/butterfly.scss';
@import './styles/element-overwrite.scss';

/* Global Styles */
html, body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: linear-gradient(135deg, #FDF8F5 0%, #F0EBF8 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}

/* Reset Element Plus Styles */
* {
  box-sizing: border-box;
}

/* Custom Selection */
::selection {
  background: rgba(#B8A9D9, 0.3);
  color: #4a4a4a;
}

/* Smooth Scroll */
html {
  scroll-behavior: smooth;
}

/* Loading Animation */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-spin {
  animation: spin 1s linear infinite;
}

/* Toast Animations */
.el-notification {
  border-radius: 16px !important;
}

/* Dialog Animations */
.el-dialog {
  border-radius: 24px !important;
  overflow: hidden;
}

/* Message Animations */
.el-message {
  border-radius: 16px !important;
}
</style>
