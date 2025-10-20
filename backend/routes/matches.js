import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

//insert a new match with auto-increment ID
router.post('/', async (req, res) => {
  try {
    const { data: maxIdResult, error: maxIdError } = await supabase
      .from('matches')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);

    if (maxIdError) {
      return res.status(500).json({ error: maxIdError.message });
    }

    const nextId = maxIdResult.length > 0 ? maxIdResult[0].id + 1 : 1;
    
    const matchDataWithId = {
      id: nextId,
      ...req.body
    };

    const { data, error } = await supabase
      .from('matches')
      .insert(matchDataWithId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json({ success: true, match: data });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all matches. later change to featured
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('id', { ascending: false })
      .limit(10); // Get latest 10 matches

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, matches: data });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single match by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("id", id)
    .single();
    
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Get users for a specific match
router.get("/:id/users", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("users_matches")
    .select("user_id")
    .eq("match_id", id)
    .eq("payment_success", true);
    
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Join a match (add user to users_matches table)
// increment current_player_count in matches table
router.post('/:id/join', async (req, res) => {
  const matchId = req.params.id;
  const { user_id, payment_success } = req.body;

  try {
    const { data: maxIdResult, error: maxIdError } = await supabase
      .from('users_matches')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);

    if (maxIdError) {
      return res.status(500).json({ error: maxIdError.message });
    }

    const nextId = maxIdResult && maxIdResult.length > 0 ? maxIdResult[0].id + 1 : 1;

    const { data, error } = await supabase
      .from('users_matches')
      .insert([{
        id: nextId,
        user_id,
        match_id: matchId,
        created_at: new Date().toISOString(),
        payment_success
      }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const { data: matchData, error: matchError } = await supabase
      .from('matches')
      .select('current_player_count')
      .eq('id', matchId)
      .single();

    if (matchError) {
      return res.status(500).json({ error: matchError.message });
    }

    const newCount = (matchData?.current_player_count || 0) + 1;

    const { error: updateError } = await supabase
      .from('matches')
      .update({ current_player_count: newCount })
      .eq('id', matchId);

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leave a match (remove user from users_matches table and decrement current_player_count)
router.post('/:id/leave', async (req, res) => {
  const matchId = req.params.id;
  const { user_id } = req.body;

  try {
    const { error: deleteError } = await supabase
      .from('users_matches')
      .delete()
      .eq('match_id', matchId)
      .eq('user_id', user_id);

    if (deleteError) {
      return res.status(500).json({ error: deleteError.message });
    }

    const { data: matchData, error: matchError } = await supabase
      .from('matches')
      .select('current_player_count')
      .eq('id', matchId)
      .single();

    if (matchError) {
      return res.status(500).json({ error: matchError.message });
    }

    const newCount = Math.max((matchData?.current_player_count || 1) - 1, 0);

    const { error: updateError } = await supabase
      .from('matches')
      .update({ current_player_count: newCount })
      .eq('id', matchId);

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
