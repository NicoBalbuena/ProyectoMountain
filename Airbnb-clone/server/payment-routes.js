const { Router } = require("express");
const { createOrder, recieveWebhook } = require("../server/payment-controller");

const mp = Router();

mp.post("/create-order/:placeId", createOrder);

mp.post("/webhook", recieveWebhook);

mp.get("/success", (req, res) => res.redirect("http://localhost:4000/success"));

// mp.get("/failure", (req, res) => res.send("Failure"));

// mp.get("/pending", (req, res) => res.send("Pending"));

module.exports = mp;