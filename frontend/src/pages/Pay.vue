<template>
<div class="container-fluid">
  <h2 class="mx-4 my-4">Complete Payment</h2>
  <div class="row justify-content-center mb-5">

    <!-- start of booking details card -->
    <div class="col-7">
      <div class="card mb-3">
        <div class="card-header">
          <h4 class="card-title">Booking Details</h4>
          <p class="text-muted small mb-0">Your court reservation information</p>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <!-- location -->
            <div class="col-6">
              <div class="d-flex align-items-start gap-3">
                <div class="bg-secondary rounded d-flex align-items-center justify-content-center flex-shrink-0" style="width:40px; height:40px;">
                  <i class="bi bi-geo-alt-fill"></i>
                </div>
                <div>
                  <div class="text-muted fw-medium small">Location</div>
                  <div class="fw-semibold">Serangoon CC</div>
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
                  <div class="fw-semibold">21 October 2025</div>
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
                  <div class="fw-semibold">2:00PM - 4:00PM</div>
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
                  <div class="fw-semibold">4 Players</div>
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
          <p class="text-muted small mb-0">Input your payment details to complete</p>
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
        <div class="card-body">
          <div class="d-flex justify-content-between mb-3">
            <div class="text-muted fw-medium">Court Rental</div>
            <div class="fw-medium">$200</div>
          </div>

          <div class="d-flex justify-content-between mb-3">
            <div class="text-muted fw-medium">Number of Players</div>
            <div class="fw-medium">4</div>
          </div>

          <div class="d-flex justify-content-between mb-3">
            <div class="text-muted fw-medium">Amount Per Pax (SGD)</div>
            <div class="fw-medium">50</div>
          </div>

          <hr>
          <div class="d-flex justify-content-between mb-3">
            <div class="text-muted fw-medium">Subtotal</div>
            <div class="fw-medium">$50</div>
          </div>

          <div class="d-flex justify-content-between mb-3">
            <div class="text-muted fw-medium">Processing fees</div>
            <div class="fw-medium">$0.00</div>
          </div>

          <div class="d-flex justify-content-between">
            <h4 class="text-muted fw-medium">Total</h4>
            <h4 class="fw-medium">$50.00</h4>
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
          body: JSON.stringify({ amount: 5000, currency: "sgd" })
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
