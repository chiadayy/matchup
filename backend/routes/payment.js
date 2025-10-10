import dotenv from "dotenv";
dotenv.config(); 
import express from "express";
import Stripe from "stripe";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

export default router;
