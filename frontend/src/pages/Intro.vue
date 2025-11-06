<template>
  <div class="intro-container" :class="{ transitioning: isTransitioning }" @click="handleDribble">
    <!-- Gradient background with animated glow -->
    <div class="gradient-background"></div>
    <!-- Three.js canvas on top -->
    <canvas ref="canvasRef"></canvas>
    <div class="intro-content" :class="{ hidden: isTransitioning || dribbleCount > 0 }">
      <h1 class="intro-title">MATCHUP</h1>
      <p class="intro-subtitle">Meet the team! Click 6 times</p>

      <!-- Floating hints -->
      <p class="hint drag-hint" v-if="showDragHint">
        Drag to spin 🌀
      </p>
    </div>

    <!-- Progress indicator (shows after first click) -->
    <div class="progress-indicator" v-if="dribbleCount > 0 && dribbleCount < teammates.length && !isTransitioning">
      <p class="progress-text">{{ dribbleCount }}/{{ teammates.length }}</p>
    </div>
    <div class="progress-indicator" v-if="dribbleCount === teammates.length && !isTransitioning">
      <p class="ready-text">Click once more! 🚀</p>
    </div>

    <!-- Flying Orbs and Team Cards -->
    <div class="team-cards-container">
      <div
        v-for="(card, index) in teamCards"
        :key="index"
        class="team-card-wrapper"
        :class="{ 'card-visible': card.visible, ['position-' + index]: true }"
        :style="{
          left: card.x + 'px',
          top: card.y + 'px'
        }"
      >
        <!-- Glowing Orb -->
        <div class="orb" :class="{ 'orb-transform': card.transforming }"></div>

        <!-- Team Card (appears after orb lands) -->
        <div class="team-card" :class="{ 'card-show': card.showCard }">
          <div class="card-image">
            <img :src="card.photo" :alt="card.name" />
          </div>
          <div class="card-info">
            <h3 class="card-name">{{ card.name }}</h3>
            <p class="card-role">{{ card.role }}</p>
            <p class="card-sport">{{ card.sport }}</p>
            <p class="card-quote">"{{ card.quote }}"</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { markRaw } from 'vue';

export default {
  name: 'Intro',
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      basketball: null,
      animationId: null,
      mouseX: 0,
      mouseY: 0,
      isTransitioning: false,
      transitionProgress: 0,
      rotationSpeed: { x: 0.005, y: 0.01 },
      scale: 1,
      zoomSpeed: 0,
      cameraStartZ: 5,
      dribbleCount: 0,
      dribbleRequired: 6, // 6 team members = 6 dribbles
      bounceSound: null,
      showDragHint: true,
      showClickHint: false,
      teamCards: [],
      orbsActive: false,
      teammates: [
        {
          name: 'Tennis',
          role: 'Singles or doubles!',
          photo: '/images/team/tennis.jpg',
          sport: 'The first tennis ball was made of wool',
          quote: 'You cant measure success if you have never failed'
        },
        {
          name: 'Golf',
          role: 'Hole in One',
          photo: '/images/team/golf.jpg',
          sport: 'Golf was invented in Scotland',
          quote: 'Work hard to get good then work hard to get better'
        },
        {
          name: 'Table Tennis',
          role: 'Most popular racket sport',
          photo: '/images/team/bingzi.jpg',
          sport: 'Table tennis ball can travel as fast as 100mph',
          quote: 'Theres no way around hardwork, embrace it!'
          
        },
        {
          name: 'Hockey',
          role: 'Sticks and ball to score!',
          photo: '/images/team/hockey.jpg',
          sport: 'Hockey pucks are frozen',
          quote: 'You cant measure success if you have never failed!'
        },
        {
          name: 'Surfing',
          role: 'Riding the waves',
          photo: '/images/team/surfing.jpg',
          sport: 'Surfing was a form of courtship',
          quote: 'A man who wins is a man who thinks he can!'
        }
      ],
      isDragging: false,
      previousMouseX: 0,
      previousMouseY: 0,
      dragVelocityX: 0,
      dragVelocityY: 0
    };
  },
  mounted() {
    this.$nextTick(() => {
      try {
        this.initThree();
        this.animate();

        // Mouse/touch drag controls
        window.addEventListener('mousedown', this.onDragStart);
        window.addEventListener('mousemove', this.onDragMove);
        window.addEventListener('mouseup', this.onDragEnd);

        // Touch controls for mobile
        window.addEventListener('touchstart', this.onTouchStart);
        window.addEventListener('touchmove', this.onTouchMove);
        window.addEventListener('touchend', this.onDragEnd);

        window.addEventListener('resize', this.onWindowResize);

        // Initialize bounce sound (using Web Audio API for inline audio)
        this.createBounceSound();

        // Hide drag hint after 4 seconds
        setTimeout(() => {
          this.showDragHint = false;
        }, 4000);
      } catch (error) {
        console.error('Error initializing:', error);
      }
    });
  },
  beforeUnmount() {
    window.removeEventListener('mousedown', this.onDragStart);
    window.removeEventListener('mousemove', this.onDragMove);
    window.removeEventListener('mouseup', this.onDragEnd);
    window.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onDragEnd);
    window.removeEventListener('resize', this.onWindowResize);
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  },
  methods: {
    initThree() {
      if (!this.$refs.canvasRef) {
        console.error('Canvas ref not found');
        return;
      }

      // Scene - use markRaw to prevent Vue reactivity
      this.scene = markRaw(new THREE.Scene());
      // No background color - make it transparent

      // Camera
      this.camera = markRaw(new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      ));
      this.camera.position.z = this.cameraStartZ;

      // Renderer with transparent background
      this.renderer = markRaw(new THREE.WebGLRenderer({
        canvas: this.$refs.canvasRef,
        antialias: true,
        alpha: true // Enable transparency
      }));
      this.renderer.setClearColor(0x000000, 0); // Transparent background
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);

      console.log('Three.js initialized successfully');

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      this.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      this.scene.add(directionalLight);

      const pointLight = new THREE.PointLight(0xff6b35, 1, 100);
      pointLight.position.set(-5, 5, 5);
      this.scene.add(pointLight);

      // Create Basketball
      this.createBasketball();
    },

    createBasketball() {
      const geometry = new THREE.SphereGeometry(1.5, 32, 32);

      // Create basketball texture with team faces
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');

      // Orange background
      ctx.fillStyle = '#FF6B35';
      ctx.fillRect(0, 0, 1024, 1024);

      // Add team member face placeholders
      // You can replace these with actual image URLs
      const facePositions = [
        { x: 256, y: 256, size: 180 },   // Top left
        { x: 768, y: 256, size: 180 },   // Top right
        { x: 256, y: 768, size: 180 },   // Bottom left
        { x: 768, y: 768, size: 180 },   // Bottom right
        { x: 512, y: 512, size: 200 }    // Center (bigger)
      ];

      // Draw face circles with placeholder avatars
      facePositions.forEach((pos, index) => {
        // Draw circular clipping path for face
        ctx.save();
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pos.size / 2, 0, Math.PI * 2);
        ctx.clip();

        // Placeholder gradient face (replace with actual images)
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, pos.size / 2);
        gradient.addColorStop(0, '#FFD700'); // Gold center
        gradient.addColorStop(0.5, '#FFA500'); // Orange middle
        gradient.addColorStop(1, '#FF8C00'); // Dark orange edge
        ctx.fillStyle = gradient;
        ctx.fillRect(pos.x - pos.size / 2, pos.y - pos.size / 2, pos.size, pos.size);

        // Add placeholder emoji/icon
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${pos.size * 0.4}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const emojis = ['👤', '👥', '🏀', '⚽', '🎾'];
        ctx.fillText(emojis[index], pos.x, pos.y);

        ctx.restore();

        // Draw circle border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pos.size / 2, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Draw basketball lines on top
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 6;

      // Horizontal middle line
      ctx.beginPath();
      ctx.moveTo(0, 512);
      ctx.lineTo(1024, 512);
      ctx.stroke();

      // Vertical curves
      ctx.beginPath();
      ctx.arc(512, 512, 300, 0, Math.PI * 2);
      ctx.stroke();

      // Side curves
      ctx.beginPath();
      ctx.ellipse(256, 512, 160, 400, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(768, 512, 160, 400, 0, 0, Math.PI * 2);
      ctx.stroke();

      const texture = new THREE.CanvasTexture(canvas);

      const material = new THREE.MeshPhongMaterial({
        map: texture,
        shininess: 30
      });

      this.basketball = markRaw(new THREE.Mesh(geometry, material));
      this.scene.add(this.basketball);

      console.log('Basketball with team faces created and added to scene');
    },

    // Helper method to load actual face images (you can call this with URLs)
    async loadTeamFaces(faceUrls) {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');

      // Orange background
      ctx.fillStyle = '#FF6B35';
      ctx.fillRect(0, 0, 1024, 1024);

      const facePositions = [
        { x: 256, y: 256, size: 180 },
        { x: 768, y: 256, size: 180 },
        { x: 256, y: 768, size: 180 },
        { x: 768, y: 768, size: 180 },
        { x: 512, y: 512, size: 200 }
      ];

      // Load and draw face images
      const imagePromises = faceUrls.slice(0, 5).map((url, index) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            const pos = facePositions[index];
            ctx.save();
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, pos.size / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(img, pos.x - pos.size / 2, pos.y - pos.size / 2, pos.size, pos.size);
            ctx.restore();

            // Circle border
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, pos.size / 2, 0, Math.PI * 2);
            ctx.stroke();

            resolve();
          };
          img.onerror = resolve;
          img.src = url;
        });
      });

      await Promise.all(imagePromises);

      // Draw basketball lines
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, 512);
      ctx.lineTo(1024, 512);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(512, 512, 300, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(256, 512, 160, 400, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(768, 512, 160, 400, 0, 0, Math.PI * 2);
      ctx.stroke();

      const texture = new THREE.CanvasTexture(canvas);
      this.basketball.material.map = texture;
      this.basketball.material.needsUpdate = true;
    },

    animate() {
      if (!this.renderer || !this.scene || !this.camera || !this.basketball) {
        console.error('Missing required objects for animation');
        return;
      }

      this.animationId = requestAnimationFrame(this.animate);

      if (this.isTransitioning) {
        // SWOOSH + CAMERA DEPTH REVEAL TRANSITION
        this.transitionProgress += 0.03;

        // Speed up rotation exponentially
        this.rotationSpeed.x *= 1.1;
        this.rotationSpeed.y *= 1.1;
        this.basketball.rotation.x += this.rotationSpeed.x;
        this.basketball.rotation.y += this.rotationSpeed.y;

        // Scale up the basketball MASSIVELY
        this.scale += 0.15;
        this.basketball.scale.set(this.scale, this.scale, this.scale);

        // CAMERA DOLLY: Move camera INTO the basketball
        // Camera zooms forward toward basketball (reducing Z position)
        this.camera.position.z -= 0.25;

        // Also move basketball slightly toward camera for combined effect
        this.zoomSpeed += 0.15;
        this.basketball.position.z += this.zoomSpeed;

        // Add motion blur by adjusting camera FOV (tunnel vision effect)
        this.camera.fov += 3.5;
        this.camera.updateProjectionMatrix();

        // Fade out basketball material as camera enters it
        if (this.transitionProgress > 0.5) {
          const fadeAmount = (this.transitionProgress - 0.5) * 2; // 0 to 1 in second half
          this.basketball.material.opacity = 1 - fadeAmount;
          this.basketball.material.transparent = true;
        }

        // When transition is complete, navigate to landing page
        if (this.transitionProgress >= 1) {
          this.$router.push('/landing');
        }
      } else {
        // NORMAL IDLE ANIMATION
        if (this.isDragging) {
          // Direct rotation control while dragging
          this.basketball.rotation.y += this.dragVelocityX;
          this.basketball.rotation.x += this.dragVelocityY;
        } else {
          // Momentum-based rotation when not dragging
          this.basketball.rotation.x += this.rotationSpeed.x;
          this.basketball.rotation.y += this.rotationSpeed.y;

          // Add drag velocity for momentum
          this.basketball.rotation.x += this.dragVelocityY;
          this.basketball.rotation.y += this.dragVelocityX;

          // Apply friction to slow down momentum
          this.dragVelocityX *= 0.95;
          this.dragVelocityY *= 0.95;

          // Floating effect
          this.basketball.position.y = Math.sin(Date.now() * 0.001) * 0.3;
        }
      }

      this.renderer.render(this.scene, this.camera);
    },

    onDragStart(event) {
      this.isDragging = true;
      this.previousMouseX = event.clientX;
      this.previousMouseY = event.clientY;
    },

    onDragMove(event) {
      if (!this.isDragging) return;

      const deltaX = event.clientX - this.previousMouseX;
      const deltaY = event.clientY - this.previousMouseY;

      // Update velocity based on drag movement
      this.dragVelocityX = deltaX * 0.01;
      this.dragVelocityY = deltaY * 0.01;

      this.previousMouseX = event.clientX;
      this.previousMouseY = event.clientY;
    },

    onDragEnd() {
      this.isDragging = false;
      // Velocity continues with momentum
    },

    onTouchStart(event) {
      if (event.touches.length > 0) {
        this.isDragging = true;
        this.previousMouseX = event.touches[0].clientX;
        this.previousMouseY = event.touches[0].clientY;
      }
    },

    onTouchMove(event) {
      if (!this.isDragging || event.touches.length === 0) return;

      const deltaX = event.touches[0].clientX - this.previousMouseX;
      const deltaY = event.touches[0].clientY - this.previousMouseY;

      this.dragVelocityX = deltaX * 0.01;
      this.dragVelocityY = deltaY * 0.01;

      this.previousMouseX = event.touches[0].clientX;
      this.previousMouseY = event.touches[0].clientY;

      event.preventDefault();
    },

    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    createBounceSound() {
      // Create a simple bounce sound using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();

      this.bounceSound = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Bounce sound: quick low frequency thump
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.1);

        // Volume envelope
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      };
    },

    playBounceSound() {
      if (this.bounceSound) {
        try {
          this.bounceSound();
        } catch (error) {
          console.log('Audio playback failed:', error);
        }
      }
    },

    triggerHaptic() {
      // Mobile haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    },

    handleDribble() {
      if (this.isTransitioning) return;

      // Increment dribble count
      this.dribbleCount++;

      // Play sound and haptic
      this.playBounceSound();
      this.triggerHaptic();

      // Animate basketball bounce
      this.animateBasketballBounce();

      // Spawn ONE team member card for this dribble (only for clicks 1-5)
      if (this.dribbleCount <= this.teammates.length) {
        this.spawnSingleCard(this.dribbleCount - 1); // Array is 0-indexed
      }

      // If reached 6th click (after all 5 members shown), transition to landing
      if (this.dribbleCount >= this.dribbleRequired) {
        setTimeout(() => {
          this.goToLanding();
        }, 500); // Quick transition on 6th click
      }
    },

    spawnSingleCard(index) {
      // Don't spawn if index is out of bounds
      if (index >= this.teammates.length) return;

      const teammate = this.teammates[index];

      // Define specific positions for each card
      // 4 corners first, then center for the 5th
      const positions = [
        { x: window.innerWidth * 0.15, y: window.innerHeight * 0.15 },  // Top-left (Bingzi)
        { x: window.innerWidth * 0.85 - 220, y: window.innerHeight * 0.15 },  // Top-right (Ada)
        { x: window.innerWidth * 0.15, y: window.innerHeight * 0.85 - 300 },  // Bottom-left (Darrion)
        { x: window.innerWidth * 0.85 - 220, y: window.innerHeight * 0.85 - 300 },  // Bottom-right (Peow Yeow)
        { x: window.innerWidth / 2 - 110, y: window.innerHeight / 2 - 150 }  // Center (Yan Shuen)
      ];

      const position = positions[index];
      const x = position.x;
      const y = position.y;

      // Add card with orb
      this.teamCards.push({
        ...teammate,
        x,
        y,
        visible: true,
        transforming: false,
        showCard: false
      });

      // Transform orb after it flies in (much faster now!)
      setTimeout(() => {
        const cardIndex = this.teamCards.length - 1;
        this.teamCards[cardIndex].transforming = true;

        // Show card after transformation
        setTimeout(() => {
          this.teamCards[cardIndex].showCard = true;
        }, 300); // Faster card reveal
      }, 400); // Faster orb flight
    },

    animateBasketballBounce() {
      // Create bounce animation on basketball
      if (this.basketball) {
        const startY = this.basketball.position.y;
        const startScale = this.basketball.scale.x;
        const targetScale = startScale + 0.3; // Permanently enlarge by 0.3 each click
        const bounceHeight = 0.5;
        const duration = 300; // ms
        const startTime = Date.now();

        const bounce = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Sine wave for bounce
          this.basketball.position.y = startY + Math.sin(progress * Math.PI) * bounceHeight;

          // Smoothly scale up to new size (no return)
          const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
          const currentScale = startScale + (targetScale - startScale) * easeProgress;
          this.basketball.scale.set(currentScale, currentScale, currentScale);

          if (progress < 1) {
            requestAnimationFrame(bounce);
          } else {
            this.basketball.position.y = startY;
            this.basketball.scale.set(targetScale, targetScale, targetScale);
          }
        };

        bounce();
      }
    },

    goToLanding() {
      if (this.isTransitioning) return; // Prevent multiple clicks
      this.isTransitioning = true;

      // Play final sound and haptic
      this.playBounceSound();
      this.triggerHaptic();

      // Add flash overlay
      const flash = document.createElement('div');
      flash.className = 'transition-flash';
      document.body.appendChild(flash);

      // Trigger flash animation
      setTimeout(() => {
        flash.classList.add('active');
      }, 10);

      // Remove flash element after animation completes
      setTimeout(() => {
        if (flash.parentNode) {
          flash.parentNode.removeChild(flash);
        }
      }, 700); // Remove after 700ms (animation duration + buffer)
    }
  }
};
</script>

<style scoped>
.intro-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  cursor: pointer;
  overflow: hidden;
}

/* Gradient background with animated glow */
.gradient-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, #ffb347 0%, #ff7a1c 60%, #e34a00 100%);
  z-index: 1;
  animation: subtleGlow 4s ease-in-out infinite alternate;
}

@keyframes subtleGlow {
  0% {
    opacity: 0.95;
    transform: scale(1);
  }
  100% {
    opacity: 1;
    transform: scale(1.02);
  }
}

/* Three.js canvas on top of gradient */
canvas {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.intro-content {
  position: absolute;
  top: 25%; /* Move text to upper portion, above basketball */
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10; /* Above both Vanta and Three.js canvas */
  pointer-events: none;
  transition: opacity 0.3s ease-out;
}

.intro-content.hidden {
  opacity: 0;
  pointer-events: none;
}

/* Progress Indicator (after first click) */
.progress-indicator {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  text-align: center;
}

.progress-indicator .progress-text {
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  animation: pulse 0.5s ease;
}

.progress-indicator .ready-text {
  font-size: 1.6rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
  animation: bounceIn 0.6s ease;
}

.intro-title {
  font-size: 5rem;
  font-weight: 900;
  color: #1d1d1f;
  margin: 0;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: fadeInDown 1s ease 0.5s both;
}

.intro-subtitle {
  font-size: 1.3rem;
  color: #ffffff;
  margin-top: 20px;
  animation: fadeInUp 1s ease 1s both;
  font-weight: 500;
}

.intro-subtitle.progress-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  animation: pulse 0.5s ease;
}

.intro-subtitle.ready-text {
  font-size: 1.6rem;
  font-weight: 800;
  color: #ffffff;
  animation: bounceIn 0.6s ease;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
}

/* Floating hints */
.hint {
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  animation: fadeInOut 4s ease-in-out infinite;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hint.drag-hint {
  bottom: 20%;
}

.hint.click-hint {
  bottom: 15%;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  animation: bounceHint 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0;
    transform: translateX(-50%) translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) translateY(-10px);
  }
}

@keyframes bounceHint {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-10px);
  }
}

/* Team Cards and Orbs */
.team-cards-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

.team-card-wrapper {
  position: absolute;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.team-card-wrapper.card-visible {
  opacity: 1;
}

/* Glowing Orb */
.orb {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: radial-gradient(circle, #FFD700, #FF6B35);
  box-shadow: 0 0 30px #FF6B35, 0 0 60px rgba(255, 107, 53, 0.5);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  animation: orbPulse 1s ease-in-out infinite;
  transition: all 0.5s ease;
}

.orb.orb-transform {
  width: 150px;
  height: 200px;
  border-radius: 12px;
  opacity: 0;
  transform: translate(-50%, -50%) scale(1.5);
}

/* Team Card */
.team-card {
  width: 220px;
  background: linear-gradient(135deg, #FF6B35 0%, #ff8a50 100%);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  opacity: 0;
  transform: rotateY(90deg) scale(0.8);
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.team-card.card-show {
  opacity: 1;
  transform: rotateY(0deg) scale(1);
}

.card-image {
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: #fff;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.card-info {
  padding: 16px;
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
}

.card-name {
  font-size: 1.3rem;
  font-weight: 800;
  color: #1d1d1f;
  margin: 0 0 6px 0;
}

.card-role {
  font-size: 0.85rem;
  font-weight: 600;
  color: #FF6B35;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-sport {
  font-size: 0.8rem;
  font-weight: 500;
  color: #666;
  margin: 0 0 10px 0;
}

.card-quote {
  font-size: 0.85rem;
  font-weight: 400;
  color: #444;
  font-style: italic;
  margin: 0;
  line-height: 1.3;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 107, 53, 0.2);
}

/* Different fly-in animations for each position */
@keyframes flyInTopLeft {
  0% {
    transform: translate(-300%, -300%) scale(0) rotate(-180deg);
  }
  100% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
}

@keyframes flyInTopRight {
  0% {
    transform: translate(300%, -300%) scale(0) rotate(180deg);
  }
  100% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
}

@keyframes flyInBottomLeft {
  0% {
    transform: translate(-300%, 300%) scale(0) rotate(-180deg);
  }
  100% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
}

@keyframes flyInBottomRight {
  0% {
    transform: translate(300%, 300%) scale(0) rotate(180deg);
  }
  100% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
}

@keyframes flyInCenter {
  0% {
    transform: translate(0, -500%) scale(0) rotate(360deg);
    opacity: 0;
  }
  100% {
    transform: translate(0, 0) scale(1) rotate(0deg);
    opacity: 1;
  }
}

/* Apply specific animations to each position */
.team-card-wrapper.position-0.card-visible {
  animation: flyInTopLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.team-card-wrapper.position-1.card-visible {
  animation: flyInTopRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.team-card-wrapper.position-2.card-visible {
  animation: flyInBottomLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.team-card-wrapper.position-3.card-visible {
  animation: flyInBottomRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.team-card-wrapper.position-4.card-visible {
  animation: flyInCenter 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes orbPulse {
  0%, 100% {
    box-shadow: 0 0 30px #FF6B35, 0 0 60px rgba(255, 107, 53, 0.5);
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    box-shadow: 0 0 50px #FFD700, 0 0 80px rgba(255, 107, 53, 0.8);
    transform: translate(-50%, -50%) scale(1.1);
  }
}

.bounce-indicator {
  font-size: 2rem;
  color: #FF6B35;
  margin-top: 40px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Swoosh Transition Flash Effect */
.intro-container.transitioning {
  pointer-events: none;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablets (991px) */
@media (max-width: 991px) {
  .intro-title {
    font-size: 4rem;
  }

  .intro-subtitle {
    font-size: 1.2rem;
  }

  .team-card {
    width: 200px;
  }

  .card-image {
    height: 200px;
  }

  .card-info {
    padding: 14px;
  }

  .card-name {
    font-size: 1.2rem;
  }
}

/* Mobile phones (768px) */
@media (max-width: 768px) {
  .intro-title {
    font-size: 3.5rem;
  }

  .intro-subtitle {
    font-size: 1.1rem;
    margin-top: 15px;
  }

  .bounce-indicator {
    font-size: 1.5rem;
  }

  .progress-indicator .progress-text {
    font-size: 1.5rem;
  }

  .progress-indicator .ready-text {
    font-size: 1.4rem;
  }

  /* Adjust team card positions for mobile */
  .team-card {
    width: 180px;
  }

  .card-image {
    height: 180px;
  }

  .card-info {
    padding: 12px;
  }

  .card-name {
    font-size: 1.1rem;
  }

  .card-role {
    font-size: 0.75rem;
  }

  .card-sport {
    font-size: 0.7rem;
  }

  .card-quote {
    font-size: 0.75rem;
  }

  /* Reduce orb size on mobile */
  .orb {
    width: 30px;
    height: 30px;
  }

  .orb.orb-transform {
    width: 120px;
    height: 160px;
  }

  .hint {
    font-size: 0.85rem;
  }

  .hint.drag-hint {
    bottom: 15%;
  }
}

/* Small phones (576px) */
@media (max-width: 576px) {
  .intro-content {
    top: 20%;
  }

  .intro-title {
    font-size: 2.5rem;
  }

  .intro-subtitle {
    font-size: 1rem;
    margin-top: 12px;
  }

  .bounce-indicator {
    font-size: 1.3rem;
    margin-top: 30px;
  }

  .progress-indicator {
    top: 8%;
  }

  .progress-indicator .progress-text {
    font-size: 1.3rem;
  }

  .progress-indicator .ready-text {
    font-size: 1.2rem;
  }

  /* Extra compact team cards for small phones */
  .team-card {
    width: 150px;
  }

  .card-image {
    height: 150px;
  }

  .card-info {
    padding: 10px;
  }

  .card-name {
    font-size: 1rem;
    margin-bottom: 4px;
  }

  .card-role {
    font-size: 0.7rem;
    margin-bottom: 6px;
  }

  .card-sport {
    font-size: 0.65rem;
    margin-bottom: 8px;
  }

  .card-quote {
    font-size: 0.7rem;
    padding-top: 6px;
  }

  /* Smaller orbs for small phones */
  .orb {
    width: 25px;
    height: 25px;
  }

  .orb.orb-transform {
    width: 100px;
    height: 140px;
  }

  .hint {
    font-size: 0.8rem;
  }

  .hint.drag-hint {
    bottom: 12%;
  }

  .hint.click-hint {
    bottom: 10%;
    font-size: 0.9rem;
  }
}

/* Extra small phones (375px) */
@media (max-width: 375px) {
  .intro-title {
    font-size: 2rem;
  }

  .intro-subtitle {
    font-size: 0.9rem;
  }

  .progress-indicator .progress-text {
    font-size: 1.1rem;
  }

  .progress-indicator .ready-text {
    font-size: 1rem;
  }

  /* Ultra compact cards */
  .team-card {
    width: 130px;
  }

  .card-image {
    height: 130px;
  }

  .card-info {
    padding: 8px;
  }

  .card-name {
    font-size: 0.9rem;
  }

  .card-role {
    font-size: 0.65rem;
  }

  .card-sport {
    font-size: 0.6rem;
  }

  .card-quote {
    font-size: 0.65rem;
  }

  .hint {
    font-size: 0.75rem;
  }
}
</style>

<style>
/* Global transition flash - needs to be non-scoped */
.transition-flash {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at center,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 107, 53, 0.6) 40%,
    rgba(255, 255, 255, 0.95) 80%,
    rgba(255, 255, 255, 1) 100%);
  opacity: 0;
  z-index: 9999;
  pointer-events: none;
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-flash.active {
  opacity: 1;
  animation: flashPulse 0.6s ease-out forwards;
}

@keyframes flashPulse {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1.1);
  }
  70% {
    opacity: 0.8;
    transform: scale(1.3);
  }
  100% {
    opacity: 0;
    transform: scale(1.8);
  }
}
</style>
