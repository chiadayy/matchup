import axios from "axios";

export async function createPaymentIntent(amount, currency) {
  const { data } = await axios.post("/api/payment/create-payment-intent", {
    amount,
    currency,
  });
  return data.clientSecret;
}
