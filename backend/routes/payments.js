import dotenv from "dotenv";
dotenv.config(); 
import express from "express";
import Stripe from "stripe";
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// STRIPE
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// SUPABASE
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);


// STRIPE - send money over 
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency } = req.body;
    console.log(req.body);

    // create aymentintent on stripe's servers
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    // send client_secret back to frontend
    res.json({ clientSecret: paymentIntent.client_secret });
  } 
  
  catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


// SUPABASE - READ
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("users_matches")
    .select(`*, matches!inner (location, date, time, pax, price)`);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// SUPABASE - UPDATE
router.post("/", async (req, res) => {
  const { name, email } = req.body;
  const { data, error } = await supabase.from("profiles").insert([{ name, email }]);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
