import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

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

export default router;