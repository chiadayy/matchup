import express from "express";
import cors from "cors";
import paymentRouter from "./routes/payment.js"; 

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", paymentRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log(`Server is running at http://localhost:3000`);
});

