import express from 'express';
import cors from 'cors';
import Router from 'express-promise-router';
import mercadopago from 'mercadopago';

import dotenv from 'dotenv';

dotenv.config({ path: process.env.ENV_PATH || '.env' })

const { env } = process;

const PORT = process.env.PORT || 8000;
const app = express();

mercadopago.configurations.setAccessToken(env.ML_TOKEN); 

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const router = Router();
app.use(router);

app.get('/', async (req, res) => {
  res.send('Api is live.');
});

app.get('/', async (req, res) => {
	res.send('Api is live.');
  });
  
  app.get('/public-key', async (req, res) => {
	res.status(400).send({id: env.ML_PUBLIC});
  });

// pruebas de mercadopago

app.post("/pago", (req, res) => {

	let preference = {

		// uncomment this for development

    // items: [
    //   {
    //     title: req.body.description,
    //     unit_price: 199.99,
    //     quantity: Number(req.body.quantity),
    //   }
    // ],
  	// back_urls: {
	// 		"success": "http://localhost:3000/success",
	// 		"failure": "http://localhost:3000/payment-failure",
	// 		"pending": "http://localhost:3000/payment-failure"
	// 	},
	// 	auto_return: 'approved',
	// };

	// use this for prod

    items: [
		{
		  title: req.body.description,
		  unit_price: 199.99,
		  quantity: Number(req.body.quantity),
		}
	  ],
		back_urls: {
			  "success": "https://southern-legal-tech-mvp.vercel.app/success",
			  "failure": "https://southern-legal-tech-mvp.vercel.app/payment-failure",
			  "pending": "https://southern-legal-tech-mvp.vercel.app/payment-failure"
		  },
		  auto_return: 'approved',
	  };
  

	mercadopago.preferences.create(preference)
		.then(function (response) {
			res.json({id :response.body.id})
		}).catch(function (error) {
			console.log(error);
		});
});

app.get('/feedback', function(request, response) {
	 response.json({
		Payment: request.query.payment_id,
		Status: request.query.status,
		MerchantOrder: request.query.merchant_order_id
	})
});



app.listen(PORT, () => console.log('app is live on port 8000'));
