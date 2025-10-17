<template>
  <div class="chat-wrapper">
    <div class="chat-header">
      <div class="header-content">
        <div class="header-left">
          <div class="status-indicator"></div>
          <div>
            <h2>💬 Match Chat</h2>
            <p>Real-time conversation</p>
          </div>
        </div>
      </div>
    </div>
    <div id="talkjs-container">
      <div class="chat-loading">
        <div class="loading-spinner"></div>
        <p>Connecting to chat...</p>
      </div>
    </div>
  </div>
</template>

<script>
import Talk from 'talkjs';

export default {
  name: 'ChatRoom',
  props: {
    matchId: Number,
    conversationId: String,
    currentUserId: String
  },
  
  mounted() {
    this.initializeTalkJS();
  },
  
  methods: {
    async initializeTalkJS() {
      await Talk.ready;
      
      const me = new Talk.User({
        id: this.currentUserId,
        name: 'Me',
        email: `${this.currentUserId}@test.com`
      });
      
      const appId = import.meta.env.VITE_TALKJS_APP_ID;
      if (!appId) {
        console.error('TalkJS App ID not configured');
        return;
      }

      const session = new Talk.Session({
        appId: appId,
        me: me
      });
      
      const conversation = session.getOrCreateConversation(this.conversationId);
      
      const chatbox = session.createChatbox({ theme: 'purple' });
      chatbox.select(conversation);

      // Set the theme (use the name of your theme from TalkJS dashboard)

      chatbox.mount(document.getElementById('talkjs-container'));
    }
  }
};
</script>

<style scoped>
.chat-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom: none;
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.chat-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-20%, -20%); }
}

.header-content {
  position: relative;
  padding: 24px 32px;
  z-index: 1;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  background: #48bb78;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(72, 187, 120, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { 
    box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7);
  }
  50% { 
    box-shadow: 0 0 0 8px rgba(72, 187, 120, 0);
  }
}

.chat-header h2 {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chat-header p {
  margin: 0;
  font-size: 13px;
  opacity: 0.9;
  font-weight: 500;
}

#talkjs-container {
  flex: 1;
  position: relative;
  background: #f8f9fa;
}

.chat-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.chat-loading p {
  color: #718096;
  font-size: 14px;
  font-weight: 500;
}

/* Custom TalkJS styling */
:global(#talkjs-container iframe) {
  border: none !important;
}
</style>