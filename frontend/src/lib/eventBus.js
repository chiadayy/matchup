// src/lib/eventBus.js
import { reactive } from 'vue';

// Create a reactive event bus
export const eventBus = reactive({
  events: {},
  
  // Emit an event
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  },
  
  // Listen for an event
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  },
  
  // Remove listener (cleanup)
  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }
});