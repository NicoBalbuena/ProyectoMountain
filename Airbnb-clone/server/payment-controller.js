const mercadopago = require("mercadopago");
const dotenv = require("dotenv");
const Place = require("./models/place");

dotenv.config();

const createOrder = async (req, res) => {
  mercadopago.configure({
    access_token: process.env.MP_Token,
  });

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

    console.log(preference);

    const response = await mercadopago.preferences.create(preference);

    console.log(response);
    
    if (response.body.init_point) {
      res.redirect(response.body.init_point);
    } else if (error.response && error.response.status === 400) {
      res.status(400).json({ message: "Solicitud inválida" });
    } else if (error.response && error.response.status === 404) {
      res.status(404).json({ message: "Lugar no encontrado" });
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
    mercadopago.payment
      .findById(payment.data.id)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
      });
  }

  res.sendStatus(204);
};

module.exports = { createOrder, recieveWebhook };
