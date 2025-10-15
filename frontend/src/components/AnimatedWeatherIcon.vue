<template>
  <div class="weather-icon-container">
    <!-- Sunny -->
    <div v-if="weatherType === 'clear'" class="weather-icon">
      <div class="sun">
        <div class="sun-core"></div>
        <div class="sun-ray" v-for="i in 8" :key="i" :style="{ transform: `rotate(${i * 45}deg)` }"></div>
      </div>
    </div>

    <!-- Cloudy -->
    <div v-else-if="weatherType === 'clouds'" class="weather-icon">
      <div class="cloud cloud-1">
        <div class="cloud-part"></div>
        <div class="cloud-part"></div>
        <div class="cloud-part"></div>
      </div>
      <div class="cloud cloud-2">
        <div class="cloud-part"></div>
        <div class="cloud-part"></div>
      </div>
    </div>

    <!-- Rainy -->
    <div v-else-if="weatherType === 'rain'" class="weather-icon">
      <div class="cloud rain-cloud">
        <div class="cloud-part"></div>
        <div class="cloud-part"></div>
        <div class="cloud-part"></div>
      </div>
      <div class="rain-drops">
        <div class="rain-drop" v-for="i in 5" :key="i" :style="{ animationDelay: `${i * 0.2}s`, left: `${i * 20}%` }"></div>
      </div>
    </div>

    <!-- Thunderstorm -->
    <div v-else-if="weatherType === 'thunderstorm'" class="weather-icon">
      <div class="cloud storm-cloud">
        <div class="cloud-part"></div>
        <div class="cloud-part"></div>
        <div class="cloud-part"></div>
      </div>
      <div class="lightning"></div>
      <div class="rain-drops">
        <div class="rain-drop" v-for="i in 5" :key="i" :style="{ animationDelay: `${i * 0.15}s`, left: `${i * 20}%` }"></div>
      </div>
    </div>

    <!-- Snowy -->
    <div v-else-if="weatherType === 'snow'" class="weather-icon">
      <div class="cloud snow-cloud">
        <div class="cloud-part"></div>
        <div class="cloud-part"></div>
      </div>
      <div class="snowflakes">
        <div class="snowflake" v-for="i in 6" :key="i" :style="{ animationDelay: `${i * 0.3}s`, left: `${i * 16}%` }">❄</div>
      </div>
    </div>

    <!-- Mist/Fog -->
    <div v-else-if="weatherType === 'mist' || weatherType === 'fog'" class="weather-icon">
      <div class="mist-layer" v-for="i in 3" :key="i" :style="{ animationDelay: `${i * 0.5}s`, top: `${i * 25 + 25}%` }"></div>
    </div>

    <!-- Default Partly Cloudy -->
    <div v-else class="weather-icon">
      <div class="sun sun-small">
        <div class="sun-core"></div>
      </div>
      <div class="cloud cloud-front">
        <div class="cloud-part"></div>
        <div class="cloud-part"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  condition: { type: String, default: 'clear' }
})

const weatherType = computed(() => {
  const condition = props.condition.toLowerCase()
  if (condition.includes('clear')) return 'clear'
  if (condition.includes('cloud')) return 'clouds'
  if (condition.includes('rain') || condition.includes('drizzle')) return 'rain'
  if (condition.includes('thunder') || condition.includes('storm')) return 'thunderstorm'
  if (condition.includes('snow')) return 'snow'
  if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) return 'mist'
  return 'clear'
})
</script>

<style scoped>
.weather-icon-container {
  width: 100px;
  height: 100px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.weather-icon {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Sun */
.sun {
  position: relative;
  width: 50px;
  height: 50px;
  animation: rotate 20s linear infinite;
}

.sun-small {
  width: 35px;
  height: 35px;
  position: absolute;
  top: 10px;
  right: 10px;
}

.sun-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  background: radial-gradient(circle, #fbbf24 0%, #f59e0b 100%);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.8);
  animation: pulse 3s ease-in-out infinite;
}

.sun-ray {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 12px;
  background: linear-gradient(to bottom, #fbbf24, transparent);
  border-radius: 2px;
  transform-origin: center -15px;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.1); }
}

/* Clouds */
.cloud {
  position: relative;
  display: flex;
  align-items: flex-end;
  animation: float 4s ease-in-out infinite;
}

.cloud-1 {
  animation-delay: 0s;
}

.cloud-2 {
  position: absolute;
  top: 30px;
  right: -10px;
  opacity: 0.7;
  animation-delay: 1s;
}

.cloud-front {
  position: absolute;
  bottom: 10px;
  left: 5px;
  z-index: 2;
}

.rain-cloud, .storm-cloud, .snow-cloud {
  animation: none;
  position: relative;
}

.cloud-part {
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  border-radius: 50%;
  margin: 0 -5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.cloud-part:nth-child(2) {
  width: 28px;
  height: 28px;
  margin-bottom: -5px;
}

.cloud-part:nth-child(3) {
  width: 22px;
  height: 22px;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Rain */
.rain-drops {
  position: absolute;
  bottom: 10px;
  width: 100%;
  height: 40px;
}

.rain-drop {
  position: absolute;
  width: 2px;
  height: 15px;
  background: linear-gradient(to bottom, rgba(96, 165, 250, 0.8), transparent);
  border-radius: 2px;
  animation: fall 1s linear infinite;
}

@keyframes fall {
  0% {
    transform: translateY(0) scaleY(1);
    opacity: 1;
  }
  100% {
    transform: translateY(40px) scaleY(0.5);
    opacity: 0;
  }
}

/* Thunder/Lightning */
.storm-cloud .cloud-part {
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
}

.lightning {
  position: absolute;
  top: 45px;
  left: 50%;
  width: 3px;
  height: 20px;
  background: linear-gradient(to bottom, #fbbf24, #f59e0b);
  transform: translateX(-50%);
  animation: flash 2s ease-in-out infinite;
  clip-path: polygon(50% 0%, 30% 40%, 60% 40%, 40% 100%, 70% 50%, 45% 50%);
  filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.9));
}

@keyframes flash {
  0%, 48%, 52%, 100% { opacity: 0; }
  49%, 51% { opacity: 1; }
}

/* Snow */
.snowflakes {
  position: absolute;
  bottom: 10px;
  width: 100%;
  height: 45px;
}

.snowflake {
  position: absolute;
  color: #e0f2fe;
  font-size: 16px;
  animation: snowfall 3s linear infinite;
  text-shadow: 0 0 4px rgba(224, 242, 254, 0.8);
}

@keyframes snowfall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(45px) rotate(360deg);
    opacity: 0.3;
  }
}

/* Mist/Fog */
.mist-layer {
  position: absolute;
  width: 80%;
  height: 8px;
  background: linear-gradient(to right, transparent, rgba(226, 232, 240, 0.6), transparent);
  border-radius: 4px;
  animation: drift 3s ease-in-out infinite;
}

@keyframes drift {
  0%, 100% { transform: translateX(-10px); opacity: 0.4; }
  50% { transform: translateX(10px); opacity: 0.7; }
}
</style>
