<template>
  <div class="container mt-5">
    <h2 class="mb-4">Make Payment</h2>

    <div class="card">
        <div class="card-body">
            <h5 class="card-title">Paying for Tennis Game</h5>
            <p class="card-text">Location: Hougang Tennis Court</p>
            <p class="card-text">Amount to Pay: $50</p>

            <form id="payment-form" @submit.prevent="handlePayment">
            <!-- Stripe Card Element mounts here -->
            <div id="card-element" class="form-control mb-3"></div>

            <button type="submit" class="btn btn-primary" :disabled="loading">
                {{ loading ? "Processing..." : "Pay" }}
            </button>

            <p id="result" class="mt-3">{{ message }}</p>
            </form>
        </div>
        </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const message = ref("");
const loading = ref(false);
let stripe, cardElement, elements;

onMounted(async () => {
  // Load Stripe with your publishable key
  stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  // Set up Stripe Elements
  elements = stripe.elements();
  cardElement = elements.create("card");
  cardElement.mount("#card-element");
});

async function handlePayment() {
  loading.value = true;
  message.value = "";

  try {
    // 1. Ask backend to create a PaymentIntent
    const { data } = await axios.post("/api/payment/create-payment-intent", {
      amount: 5000, // $50.00
      currency: "usd",
    });

    const clientSecret = data.clientSecret;

    // 2. Confirm the payment on frontend
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (result.error) {
      message.value = result.error.message;
    } else if (result.paymentIntent.status === "succeeded") {
      message.value = "Payment successful!";
    }
  } catch (err) {
    message.value = "Error: " + err.message;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
#card-element {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
