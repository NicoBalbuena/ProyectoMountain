// const mercadopago = require("mercadopago");
const dotenv = require("dotenv");
const Place = require("./models/place");
const axios = require('axios');

dotenv.config();

const createOrder = async (req, res) => {
  const placeId = req.params.placeId;

  if (!placeId) {
    return res.status(400).json({ message: "Invalid place ID" });
  }

  try {
    const place = await Place.findById(placeId);

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    const preference = {
      items: [
        {
          title: place.title,
          unit_price: parseFloat(place.price),
          currency_id: "ARS",
          quantity: 1,
        },
      ],
      back_urls: {
        success: "http://localhost:4000/success",
      },
      notification_url: "http://localhost:4000/webhook",
    };

    const mercadopagoHeaders = {
      'Authorization': `Bearer ${process.env.MP_TOKEN}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.post(
      'https://api.mercadopago.com/checkout/preferences',
      preference,
      { headers: mercadopagoHeaders }
    );

    if (response.data.init_point) {
      res.redirect(response.data.init_point);
    } else {
      res.status(500).json({ message: "Error al procesar el pago" });
    }
  } catch (error) {
    console.error(error);
    if (error.response && error.response.status === 400) {
      res.status(400).json({ message: "Solicitud inválida" });
    } else if (error.response && error.response.status === 404) {
      res.status(404).json({ message: "Lugar no encontrado" });
    } else {
      res.status(500).json({ message: "Error al procesar el pago" });
    }
  }
};

const recieveWebhook = (req, res) => {
  const payment = req.body;

  console.log(payment);

  if (payment.type === "payment") {
    axios.get(`https://api.mercadopago.com/v1/payments/${payment.data.id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.MP_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })
    .then((data) => {
      console.log(data.data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    });
  }

  res.sendStatus(204);
};

module.exports = { createOrder, recieveWebhook };