<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  notification: {
    type: Object,
    default: null
  },
  duration: {
    type: Number,
    default: 5000
  }
})

const emit = defineEmits(['close', 'click'])

const router = useRouter()
const visible = ref(false)
const progress = ref(100)
let timer = null
let progressTimer = null

watch(() => props.notification, (newVal) => {
  if (newVal) {
    show()
  }
}, { immediate: true })

function show() {
  visible.value = true
  startTimer()
  startProgress()
}

function startTimer() {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    close()
  }, props.duration)
}

function startProgress() {
  progress.value = 100
  const step = 100 / (props.duration / 50)
  
  if (progressTimer) clearInterval(progressTimer)
  progressTimer = setInterval(() => {
    progress.value = Math.max(0, progress.value - step)
  }, 50)
}

function close() {
  visible.value = false
  if (timer) clearTimeout(timer)
  if (progressTimer) clearInterval(progressTimer)
  emit('close')
}

function handleClick() {
  if (props.notification?.data?.orderId) {
    router.push(`/order?id=${props.notification.data.orderId}`)
  }
  close()
  emit('click', props.notification)
}

function handleMouseEnter() {
  if (timer) clearTimeout(timer)
  if (progressTimer) clearInterval(progressTimer)
}

function handleMouseLeave() {
  startTimer()
  startProgress()
}
</script>

<template>
  <Transition name="slide">
    <div 
      v-if="visible && notification" 
      class="new-order-toast"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="handleClick"
    >
      <div class="toast-icon">
        <span class="butterfly">🦋</span>
      </div>
      
      <div class="toast-content">
        <p class="toast-title">{{ notification.title }}</p>
        <p class="toast-message">{{ notification.message }}</p>
        <div v-if="notification.data?.order" class="toast-details">
          <span class="detail-item">{{ notification.data.order.gameType }}</span>
          <span class="detail-separator">•</span>
          <span class="detail-item">{{ notification.data.order.targetTier }}</span>
        </div>
      </div>
      
      <button class="toast-close" @click.stop="close">
        ✕
      </button>
      
      <div class="toast-progress" :style="{ width: `${progress}%` }"></div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.new-order-toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 380px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(#B8A9D9, 0.2);
  border: 1px solid rgba(#B8A9D9, 0.2);
  cursor: pointer;
  overflow: hidden;
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(-4px);
    box-shadow: 0 12px 40px rgba(#B8A9D9, 0.25);
  }
}

.toast-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(#B8A9D9, 0.2), rgba(#FFB7B2, 0.2));
  border-radius: 12px;
  flex-shrink: 0;

  .butterfly {
    font-size: 24px;
    animation: flutter 1s ease-in-out infinite;
  }
}

@keyframes flutter {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-4px) rotate(5deg); }
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  margin: 0 0 4px;
  font-weight: 600;
  font-size: 15px;
  color: #4a4a4a;
}

.toast-message {
  margin: 0 0 8px;
  font-size: 13px;
  color: #888;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toast-details {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #B8A9D9;

  .detail-separator {
    color: #ccc;
  }
}

.toast-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(#B8A9D9, 0.1);
  border-radius: 6px;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(#FFB7B2, 0.3);
    color: #c97070;
  }
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #B8A9D9, #FFB7B2);
  transition: width 0.05s linear;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
