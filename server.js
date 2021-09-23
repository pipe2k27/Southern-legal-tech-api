import express from 'express';
import cors from 'cors';
import Router from 'express-promise-router';
import mercadopago from 'mercadopago';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import userEndpoint from './routes/Users/users.js';

dotenv.config({ path: process.env.ENV_PATH || '.env' });

const { env } = process;

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

export const jwtCheck = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://andesdocs.us.auth0.com/.well-known/jwks.json',
  }),
  audience: 'https://andesdocs/api',
  issuer: 'https://andesdocs.us.auth0.com/',
  algorithms: ['RS256'],
});

// app.use(jwtCheck);

mercadopago.configurations.setAccessToken(env.ML_TOKEN);

// Mongo db Database Connection

const dbUri = `mongodb+srv://AndesDocsDevelopment:${env.MONGO_DB}@andesdocs01.1iiry.mongodb.net/AndesDocs01?retryWrites=true&w=majority`;

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => { app.listen(PORT, () => console.log('app now live on port 8000')); })
  .catch((e) => console.log(e));

// Router Set up

const router = Router();
app.use(router);

app.get('/', async (req, res) => {
  res.send('Api is live.');
});

// this is the main endpoint where our front end will be making requests
router.use('/users', jwtCheck, userEndpoint);

app.get('/public-key', async (req, res) => {
  res.status(200).send({ id: env.ML_PUBLIC });
});

// pruebas de mercadopago

app.post('/pago', (req, res) => {
  let preference;

  if (env.ENV === 'development') {
    preference = {
      // uncomment this for development
      items: [
        {
          title: req.body.description,
          unit_price: 999,
          quantity: Number(req.body.quantity),
        },
      ],
      back_urls: {
        success: 'http://localhost:3000/success',
        failure: 'http://localhost:3000/payment-error',
        pending: 'http://localhost:3000/payment-error',
      },
      auto_return: 'approved',
    };
    // use this for prod
  } else {
    preference = {
      items: [
        {
          title: req.body.description,
          unit_price: 4999,
          quantity: Number(req.body.quantity),
        },
      ],
      back_urls: {
        success: 'https://andesdocs.com/success',
        failure: 'https://andesdocs.com/payment-error',
        pending: 'https://andesdocs.com/payment-error',
      },
      auto_return: 'approved',
    };
  }

  mercadopago.preferences.create(preference)
    .then((response) => {
      res.json({ id: response.body.id });
    }).catch((error) => {
      console.log(error);
    });
});

app.get('/feedback', (request, response) => {
  response.json({
    Payment: request.query.payment_id,
    Status: request.query.status,
    MerchantOrder: request.query.merchant_order_id,
  });
});

export default null;
