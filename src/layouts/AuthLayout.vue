<script setup>
</script>

<template>
  <div class="auth-layout">
    <!-- Background Decoration -->
    <div class="bg-decoration">
      <div class="butterfly butterfly-1">🦋</div>
      <div class="butterfly butterfly-2">🦋</div>
      <div class="butterfly butterfly-3">🦋</div>
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- Main Content -->
    <div class="auth-container">
      <div class="auth-content">
        <!-- Logo Section -->
        <div class="logo-section">
          <img src="@/assets/logo.svg" alt="3Plus3 Club" class="auth-logo" />
          <h1 class="brand-name">3Plus3 Club</h1>
          <p class="brand-slogan">游戏陪练服务平台</p>
        </div>

        <!-- Form Section -->
        <div class="form-section">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FDF8F5 0%, #F0EBF8 100%);
  position: relative;
  overflow: hidden;
}

// Background Decoration
.bg-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.butterfly {
  position: absolute;
  font-size: 40px;
  opacity: 0.3;
  animation: float 6s ease-in-out infinite;

  &.butterfly-1 {
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }

  &.butterfly-2 {
    top: 20%;
    right: 15%;
    animation-delay: 2s;
    font-size: 30px;
  }

  &.butterfly-3 {
    bottom: 20%;
    left: 20%;
    animation-delay: 4s;
    font-size: 25px;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(#B8A9D9, 0.2), rgba(#FFB7B2, 0.1));
  filter: blur(60px);

  &.circle-1 {
    width: 400px;
    height: 400px;
    top: -100px;
    right: -100px;
  }

  &.circle-2 {
    width: 300px;
    height: 300px;
    bottom: -50px;
    left: -50px;
  }

  &.circle-3 {
    width: 200px;
    height: 200px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, rgba(#B5EAD7, 0.2), rgba(#B8A9D9, 0.1));
  }
}

// Auth Container
.auth-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 960px;
  padding: 20px;
}

.auth-content {
  display: flex;
  gap: 60px;
  align-items: center;
  justify-content: center;
}

// Logo Section
.logo-section {
  text-align: center;
  flex-shrink: 0;

  .auth-logo {
    width: 120px;
    height: 120px;
    margin-bottom: 24px;
    animation: butterfly-float 3s ease-in-out infinite;
  }

  .brand-name {
    margin: 0 0 8px;
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #B8A9D9, #FFB7B2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .brand-slogan {
    margin: 0;
    font-size: 16px;
    color: #888;
  }
}

@keyframes butterfly-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(3deg); }
}

// Form Section
.form-section {
  flex: 1;
  max-width: 400px;
}

// Transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

// Responsive
@media (max-width: 768px) {
  .auth-content {
    flex-direction: column;
    gap: 40px;
  }

  .logo-section {
    .auth-logo {
      width: 80px;
      height: 80px;
    }

    .brand-name {
      font-size: 24px;
    }
  }

  .form-section {
    max-width: 100%;
  }
}
</style>
