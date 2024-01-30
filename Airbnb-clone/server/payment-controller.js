const dotenv = require("dotenv");
const Place = require("./models/place");
const axios = require('axios');

dotenv.config();

const mercadopagoAxios = axios.create({
  baseURL: 'https://api.mercadopago.com',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.MP_TOKEN}`,
  },
});

const createOrder = async (req, res) => {
  const placeId = req.params.placeId;
  const { totalPrice } = req.body; // Recibir el precio total desde el cuerpo de la solicitud

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
                  unit_price: parseFloat(totalPrice), // Utilizar el precio total recibido
                  currency_id: "ARS",
                  quantity: 1,
              },
          ],
          back_urls: {
              success: "http://localhost:4000/success",
          },
          notification_url: "http://localhost:4000/mp/webhook",
      };

      const response = await mercadopagoAxios.post(
          'https://api.mercadopago.com/checkout/preferences',
          preference
      );

      if (response.data.init_point) {
          res.json({ paymentUrl: response.data.init_point });
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
    mercadopagoAxios.get(`/v1/payments/${payment.data.id}`)
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
