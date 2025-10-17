import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Get single user profile
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
    
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;