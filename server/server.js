const express = require('express');
const Stripe = require('stripe');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
    console.log(req.body); 
    const { amount } = req.body;
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount, // in cents
        currency: 'usd',
      });
  
      res.status(200).send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
