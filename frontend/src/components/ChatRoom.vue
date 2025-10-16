<template>
  <div>
    <h2>Chat Room</h2>
    <div id="talkjs-container" style="height: 500px;">
      <i>Loading chat...</i>
    </div>
  </div>
</template>

<script>
import Talk from 'talkjs';

export default {
  name: 'ChatRoom',
  
  mounted() {
    this.initializeTalkJS();
  },
  
  methods: {
    async initializeTalkJS() {
      await Talk.ready;
      
      // Hardcoded for testing - we'll fix this later
      const me = new Talk.User({
        id: 'user1',
        name: 'Alice',
        email: 'alice@example.com',
        photoUrl: 'https://via.placeholder.com/150',
        welcomeMessage: 'Hey there!'
      });
      
      const other = new Talk.User({
        id: 'user2',
        name: 'Bob',
        email: 'bob@example.com',
        photoUrl: 'https://via.placeholder.com/150'
      });
      
      const appId = import.meta.env.VITE_TALKJS_APP_ID;
      if (!appId) {
        console.error('TalkJS App ID not configured. Please set VITE_TALKJS_APP_ID in your .env file');
        return;
      }

      const session = new Talk.Session({
        appId: appId,
        me: me
      });
      
      const conversation = session.getOrCreateConversation('conversation1');
      conversation.setParticipant(me);
      conversation.setParticipant(other);
      
      const inbox = session.createInbox();
      inbox.select(conversation);
      inbox.mount(document.getElementById('talkjs-container'));
    }
  }
};
</script>