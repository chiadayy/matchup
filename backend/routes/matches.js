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
    console.log('📥 Creating match:', req.body);

    const { data: maxIdResult, error: maxIdError } = await supabase
      .from('matches')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);

    if (maxIdError) {
      return res.status(500).json({ error: maxIdError.message });
    }

    const nextId = maxIdResult.length > 0 ? maxIdResult[0].id + 1 : 1;
    
    console.log(`🔢 Next ID will be: ${nextId}`);

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

export default router;