import express from "express";
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const TALKJS_APP_ID = process.env.TALKJS_APP_ID;
const TALKJS_SECRET_KEY = process.env.TALKJS_SECRET_KEY;

// Helper function to sync user with TalkJS
async function syncUserWithTalkJS(userId) {
  // Get user data from Supabase
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;

  // Sync with TalkJS
  const response = await fetch(
    `https://api.talkjs.com/v1/${TALKJS_APP_ID}/users/${userId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TALKJS_SECRET_KEY}`
      },
      body: JSON.stringify({
        name: profile.name || 'User',
        email: [userId],
        photoUrl: profile.profile_image || 'https://ui-avatars.com/api/?name=' + (profile.name || 'User'),
        role: 'default'
      })
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to sync user: ${errorBody}`);
  }

  return profile;
}

// Force re-sync users for a match
router.post("/sync-users/:match_id", async (req, res) => {
  try {
    const { match_id } = req.params;

    // Get the match
    const { data: match, error: matchError } = await supabase
      .from("matches")
      .select("*")
      .eq("id", match_id)
      .single();

    if (matchError) throw matchError;

    // Get all confirmed users
    const { data: confirmedUsers, error: usersError } = await supabase
      .from("users_matches")
      .select("user_id")
      .eq("match_id", match_id)
      .eq("payment_success", true);

    if (usersError) throw usersError;

    // Sync all users
    for (const user of confirmedUsers) {
      await syncUserWithTalkJS(user.user_id);
    }

    res.json({ 
      message: "Users synced successfully",
      synced_users: confirmedUsers.length
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Check if both users confirmed and create chat
router.post("/check-and-create", async (req, res) => {
  try {
    const { match_id } = req.body;

    // 1. Get the match and its host
    const { data: match, error: matchError } = await supabase
      .from("matches")
      .select("*")
      .eq("id", match_id)
      .single();

    if (matchError) throw matchError;
    if (match.conversation_id) {
      return res.json({ 
        message: "Chat already exists", 
        conversation_id: match.conversation_id 
      });
    }

    // 2. Get all confirmed users for this match
    const { data: confirmedUsers, error: usersError } = await supabase
      .from("users_matches")
      .select("user_id")
      .eq("match_id", match_id)
      .eq("payment_success", true);

    if (usersError) throw usersError;

    // 3. Check if both host and player confirmed
    const hostConfirmed = confirmedUsers.some(u => u.user_id === match.host);
    const playerConfirmed = confirmedUsers.some(u => u.user_id !== match.host);

    if (!hostConfirmed || !playerConfirmed) {
      return res.json({ 
        message: "Waiting for both users to confirm",
        host_confirmed: hostConfirmed,
        player_confirmed: playerConfirmed
      });
    }

    // 4. Get player ID
    const playerId = confirmedUsers.find(u => u.user_id !== match.host).user_id;

    // 5. Sync both users with TalkJS first
    await syncUserWithTalkJS(match.host);
    await syncUserWithTalkJS(playerId);

    // 6. Create TalkJS conversation
    const conversationId = `match_${match_id}`;
    
    const talkJsResponse = await fetch(
      `https://api.talkjs.com/v1/${TALKJS_APP_ID}/conversations/${conversationId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TALKJS_SECRET_KEY}`
        },
        body: JSON.stringify({
          participants: [match.host, playerId],
          subject: match.name
        })
      }
    );

    if (!talkJsResponse.ok) {
      const errorBody = await talkJsResponse.text();
      console.error('TalkJS Error:', talkJsResponse.status, errorBody);
      throw new Error(`TalkJS API error: ${talkJsResponse.status} - ${errorBody}`);
    }

    // 7. Store conversation_id in matches table
    const { error: updateError } = await supabase
      .from("matches")
      .update({ conversation_id: conversationId })
      .eq("id", match_id);

    if (updateError) throw updateError;

    res.json({ 
      message: "Chat created successfully",
      conversation_id: conversationId 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;