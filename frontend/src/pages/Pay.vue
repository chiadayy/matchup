<template>
<div style="min-height: 100vh; background: #0f172a;">
  <!-- Header -->
  <div style="background: #1e293b; border-bottom: 1px solid #334155; padding: 20px 32px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
    <div style="display: flex; align-items: center; gap: 16px; max-width: 2000px; margin: 0 auto;">
      <!-- Logo SVG -->
      <svg width="100" height="100" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 0 12px rgba(23, 195, 212, 0.7));">
        <circle cx="70" cy="80" r="32" fill="#3B82F6"/>
        <circle cx="95" cy="75" r="27" fill="#3B82F6"/>
        <circle cx="130" cy="60" r="22" fill="#17C3D4"/>
        <line x1="130" y1="33" x2="130" y2="20" stroke="#17C3D4" stroke-width="5" stroke-linecap="round"/>
        <line x1="152" y1="48" x2="162" y2="38" stroke="#17C3D4" stroke-width="5" stroke-linecap="round"/>
        <line x1="160" y1="70" x2="172" y2="70" stroke="#17C3D4" stroke-width="5" stroke-linecap="round"/>
        <line x1="152" y1="92" x2="162" y2="102" stroke="#17C3D4" stroke-width="5" stroke-linecap="round"/>
        <path d="M100 110 C100 110, 78 138, 78 155 C78 172, 88 182, 100 182 C112 182, 122 172, 122 155 C122 138, 100 110, 100 110 Z" fill="#10B981"/>
        <circle cx="100" cy="148" r="12" fill="white"/>
        <rect x="48" y="128" width="38" height="48" rx="4" fill="#3B82F6" stroke="#3B82F6" stroke-width="2"/>
        <line x1="67" y1="128" x2="67" y2="176" stroke="white" stroke-width="3"/>
        <line x1="48" y1="152" x2="86" y2="152" stroke="white" stroke-width="3"/>
      </svg>
    </div>
  </div>

  <h2 class="mx-4 my-4 text-white">Complete Payment</h2>
  <div class="container-fluid">
    <div class="row justify-content-center mb-5">

      <!-- start of booking details card -->
      <div class="col-7">
        <div class="card mb-3">
          <div class="card-header">
            <h4 class="card-title">Booking Details</h4>
            <CardDescription>Your court reservation information</CardDescription>
          </div>
          <div class="card-body" v-if="match">
            <div class="row g-3">
              <!-- location -->
              <div class="col-6">
                <div class="d-flex align-items-start gap-3">
                  <div class="bg-secondary rounded d-flex align-items-center justify-content-center flex-shrink-0" style="width:40px; height:40px;">
                    <i class="bi bi-geo-alt-fill"></i>
                  </div>
                  <div>
                    <div class="text-muted fw-medium small">Location</div>
                    <div class="fw-semibold">{{ match.location }}</div>
                  </div>
                </div>
              </div>

              <!-- date -->
              <div class="col-6">
                <div class="d-flex align-items-start gap-3">
                  <div class="bg-secondary rounded d-flex align-items-center justify-content-center flex-shrink-0" style="width:40px; height:40px;">
                    <i class="bi bi-calendar-event-fill"></i>
                  </div>
                  <div>
                    <div class="text-muted fw-medium small">Date</div>
                    <div class="fw-semibold">{{ match.date }}</div>
                  </div>
                </div>
              </div>

              <!-- time -->
              <div class="col-6">
                <div class="d-flex align-items-start gap-3">
                  <div class="bg-secondary rounded d-flex align-items-center justify-content-center flex-shrink-0" style="width:40px; height:40px;">
                    <i class="bi bi-clock-fill"></i>
                  </div>
                  <div>
                    <div class="text-muted fw-medium small">Time</div>
                    <div class="fw-semibold">{{ match.time }}</div>
                  </div>
                </div>
              </div>

              <!-- players -->
              <div class="col-6">
                <div class="d-flex align-items-start gap-3">
                  <div class="bg-secondary rounded d-flex align-items-center justify-content-center flex-shrink-0" style="width:40px; height:40px;">
                    <i class="bi bi-person-fill"></i>
                  </div>
                  <div>
                    <div class="text-muted fw-medium small">Players</div>
                    <div class="fw-semibold">{{ match.pax }} Players</div>
                  </div>
                </div>
              </div>
            </div> 
          </div>
        </div>

        <!-- payment details -->
        <div class="card mb-3">
          <div class="card-header">
            <h4 class="card-title">Payment Details</h4>
            <CardDescription>Input your payment details to complete</CardDescription>
          </div>
          <div class="card-body">
            <form id="payment-form" @submit.prevent="handlePayment">
              <div class="mb-3">
                <label class="form-label">Cardholder Name</label>
                <input v-model="cardName" class="form-control" placeholder="Sally Lim" required>
              </div>

              <div id="card-element" class="form-control mb-3"></div>

              <div class="row">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  {{ loading ? "Processing..." : "Pay" }}
                </button>
                <p id="result" class="mt-3">{{ message }}</p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- summary -->
      <div class="col-4">
        <div class="card position-sticky" style="top: 20px;">
          <div class="card-header">
            <h4 class="card-title">Payment Summary</h4>
          </div>
          <div class="card-body" v-if="match">
            <div class="d-flex justify-content-between mb-3">
              <div class="text-muted fw-medium">Court Rental</div>
              <div class="fw-medium">{{ match.price }}</div>
            </div>

            <div class="d-flex justify-content-between mb-3">
              <div class="text-muted fw-medium">Number of Players</div>
              <div class="fw-medium">{{ match.pax }}</div>
            </div>

            <div class="d-flex justify-content-between mb-3">
              <div class="text-muted fw-medium">Amount Per Pax (SGD)</div>
              <div class="fw-medium">{{ (match.price / match.pax).toFixed(2) }}</div>
            </div>

            <hr>
            <div class="d-flex justify-content-between mb-3">
              <div class="text-muted fw-medium">Subtotal</div>
              <div class="fw-medium">${{ (match.price / match.pax).toFixed(2) }}</div>
            </div>

            <div class="d-flex justify-content-between mb-3">
              <div class="text-muted fw-medium">Processing fees</div>
              <div class="fw-medium">$0.00</div>
            </div>

            <div class="d-flex justify-content-between">
              <h4 class="text-muted fw-medium">Total</h4>
              <h4 class="fw-medium">${{ (match.price / match.pax).toFixed(2) }}</h4>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>
</template>

<script>
import { loadStripe } from "@stripe/stripe-js";

export default {
  data() {
    return {
      userMatch: [],
      stripe: null,
      elements: null,
      card: null,
      loading: false,
      message: "",
      amountPerPax: 0,
      cardName: ""
    };
  },
  computed: {
    match() {
      return this.userMatch[0]?.matches || null;
    }
  },
  async mounted() {
    this.stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    this.elements = this.stripe.elements();
    this.card = this.elements.create("card", {
      style: {
        base: {
          fontSize: "16px",
          color: "#32325d",
          "::placeholder": { color: "#a0aec0" }
        },
      },
    });
    this.card.mount("#card-element");

    try {
      const res = await fetch("http://localhost:3000/payments");
      if (!res.ok) throw new Error("Failed to fetch data");

      this.userMatch = await res.json();
      const match = this.userMatch[0]?.matches;
      if (!match) throw new Error("No match data found");

      this.amountPerPax = Math.round((match.price / match.pax) * 100);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  },
  methods: {
    async handlePayment() {
      this.loading = true;
      this.message = "";

      try {
        const res = await fetch("http://localhost:3000/payments/create-payment-intent", { 
          method: "POST", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ amount: this.amountPerPax, currency: "sgd" })
        });

        const { clientSecret } = await res.json();

        const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: this.card,
            billing_details: { name: this.cardName },
          },
        });

        if (error) this.message = error.message;
        else if (paymentIntent.status === "succeeded") this.message = "Payment successful!";
      } catch (err) {
        this.message = "Error: " + err.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
