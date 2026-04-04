<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  orderId: {
    type: [String, Number],
    required: true
  },
  playerId: {
    type: [String, Number],
    default: null
  },
  tips: {
    type: Array,
    default: () => [
      { label: '🍗 小费', value: 10, color: '#F5E6D3' },
      { label: '🍗🍗 鸡腿', value: 20, color: '#FFB7B2' },
      { label: '🍗🍗🍗 大鸡腿', value: 50, color: '#B8A9D9' }
    ]
  }
})

const emit = defineEmits(['sent'])

const loading = ref(false)
const showCustom = ref(false)
const customAmount = ref('')

async function sendTip(value) {
  loading.value = true
  try {
    // 模拟发送小费
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success(`小费 ¥${value} 已发送！`)
    emit('sent', { orderId: props.orderId, playerId: props.playerId, value })
  } catch (error) {
    ElMessage.error('发送小费失败')
  } finally {
    loading.value = false
  }
}

async function sendCustomTip() {
  const amount = parseFloat(customAmount.value)
  if (!amount || amount <= 0) {
    ElMessage.warning('请输入有效金额')
    return
  }
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success(`小费 ¥${amount} 已发送！`)
    emit('sent', { orderId: props.orderId, playerId: props.playerId, value: amount })
    showCustom.value = false
    customAmount.value = ''
  } catch (error) {
    ElMessage.error('发送小费失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="tips-button-wrapper">
    <el-popover
      placement="top"
      :width="240"
      trigger="click"
    >
      <template #reference>
        <button class="tips-trigger" :disabled="loading">
          <span class="tips-icon">🍗</span>
          <span class="tips-label">打赏</span>
        </button>
      </template>
      
      <div class="tips-panel">
        <p class="tips-title">给打手加鸡腿 🍗</p>
        
        <div class="tips-list">
          <button 
            v-for="tip in tips" 
            :key="tip.value"
            class="tip-item"
            :style="{ '--tip-color': tip.color }"
            :disabled="loading"
            @click="sendTip(tip.value)"
          >
            <span class="tip-emoji">{{ tip.label }}</span>
            <span class="tip-amount">¥{{ tip.value }}</span>
          </button>
        </div>
        
        <div class="custom-tip">
          <template v-if="!showCustom">
            <button class="custom-btn" @click="showCustom = true">
              <span>💰</span> 自定义金额
            </button>
          </template>
          <template v-else>
            <div class="custom-input-wrapper">
              <span class="currency">¥</span>
              <input 
                v-model="customAmount"
                type="number"
                class="custom-input"
                placeholder="输入金额"
                min="0"
                step="0.01"
              />
              <button 
                class="custom-submit"
                :disabled="loading || !customAmount"
                @click="sendCustomTip"
              >
                发送
              </button>
            </div>
          </template>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<style scoped lang="scss">
.tips-button-wrapper {
  display: inline-block;
}

.tips-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #F5E6D3, #FFB7B2);
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  color: #8a6a5a;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(#FFB7B2, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(#FFB7B2, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .tips-icon {
    font-size: 16px;
    animation: wiggle 2s ease-in-out infinite;
  }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

.tips-panel {
  padding: 4px;
}

.tips-title {
  margin: 0 0 12px;
  font-weight: 600;
  font-size: 14px;
  color: #4a4a4a;
  text-align: center;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.tip-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 14px;
  background: var(--tip-color, rgba(#B8A9D9, 0.1));
  border: 1px solid rgba(#B8A9D9, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateX(4px);
    border-color: #B8A9D9;
    box-shadow: 0 4px 12px rgba(#B8A9D9, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .tip-emoji {
    font-size: 16px;
  }

  .tip-amount {
    font-weight: 600;
    color: #6a5a8a;
  }
}

.custom-tip {
  padding-top: 12px;
  border-top: 1px solid rgba(#B8A9D9, 0.1);
}

.custom-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 10px;
  background: rgba(#B8A9D9, 0.1);
  border: 1px dashed rgba(#B8A9D9, 0.3);
  border-radius: 12px;
  color: #8a7a9a;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;

  &:hover {
    background: rgba(#B8A9D9, 0.15);
    border-color: #B8A9D9;
  }
}

.custom-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: rgba(#B8A9D9, 0.05);
  border-radius: 10px;

  .currency {
    font-weight: 600;
    color: #8a7a9a;
  }

  .custom-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 14px;
    color: #4a4a4a;
    outline: none;

    &::placeholder {
      color: #aaa;
    }
  }

  .custom-submit {
    padding: 6px 14px;
    background: linear-gradient(135deg, #B8A9D9, #FFB7B2);
    border: none;
    border-radius: 8px;
    color: #fff;
    font-weight: 500;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      transform: scale(1.05);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}
</style>
