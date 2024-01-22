const mercadopago = require("mercadopago");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const createOrder = (req, res) => {
  mercadopago.configure({
    access_token: process.env.MP_Token,
  });

  const placeId = req.params.placeId;

  if (!placeId) {
    return res.status(400).json({ message: "Invalid place ID" });
  }

  mongoose
    .model("Place")
    .findById(placeId)
    .then((place) => {
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
      console.log(preference)
      return mercadopago.preferences.create(preference);
    })
    .then((response) => {
      console.log(response);
      res.json(response.body);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error processing payment" });
    });
};

const recieveWebhook = (req, res) => {
  const payment = req.query;

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
