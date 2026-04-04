<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  hoverable: {
    type: Boolean,
    default: true
  },
  padding: {
    type: String,
    default: '24px'
  },
  radius: {
    type: String,
    default: '24px'
  }
})

const emit = defineEmits(['click'])

const cardStyle = computed(() => ({
  padding: props.padding,
  borderRadius: props.radius
}))
</script>

<template>
  <div 
    class="butterfly-card" 
    :class="{ 'hoverable': hoverable }"
    :style="cardStyle"
    @click="emit('click', $event)"
  >
    <div v-if="title || $slots.header" class="card-header">
      <slot name="header">
        <div class="card-title-section">
          <h3 v-if="title" class="card-title">{{ title }}</h3>
          <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
        </div>
      </slot>
    </div>
    
    <div class="card-body">
      <slot></slot>
    </div>
    
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.butterfly-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 32px rgba(#B8A9D9, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.hoverable {
    &:hover {
      box-shadow: 0 12px 40px rgba(#B8A9D9, 0.15);
      transform: translateY(-2px);
      border-color: rgba(#B8A9D9, 0.2);
    }
  }
}

.card-header {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(#B8A9D9, 0.1);
}

.card-title-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #4a4a4a;
}

.card-subtitle {
  margin: 0;
  font-size: 14px;
  color: #888;
}

.card-body {
  flex: 1;
}

.card-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(#B8A9D9, 0.1);
}
</style>
