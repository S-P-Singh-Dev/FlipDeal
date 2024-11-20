const express = require('express');
const { resolve } = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3000;

// Server-side values
let taxRate = 5; // 5%
let discountPercentage = 10; // 10%
let loyaltyRate = 2; // 2 points per $1

// Functions

function updatedCartTotal(newItemPrice, cartTotal) {
  return newItemPrice + cartTotal;
}

function discountedPriceCalc(cartTotal, isMember) {
  if (isMember === 'true') {
    let newCartTotal = cartTotal - cartTotal * (discountPercentage / 100);
    return newCartTotal;
  } else {
    return cartTotal;
  }
}

function taxCalc(cartTotal) {
  let tax = cartTotal * (taxRate / 100);
  return tax;
}

function deliveryDaysCalc(shippingMethod, distance) {
  if (shippingMethod === 'standard') {
    return Math.ceil(distance / 50);
  } else if (shippingMethod === 'express') {
    return Math.ceil(distance / 100);
  }
}

function shippingCostCalc(weight, distance) {
  return weight * distance * 0.1;
}

function loyaltyPointsCalc(purchaseAmount) {
  return purchaseAmount * loyaltyRate;
}

// API end points

app.get('/cart-total', (req, res) => {
  let newItemPrice = parseFloat(req.query.newItemPrice);
  let cartTotal = parseFloat(req.query.cartTotal);
  let newCartTotal = updatedCartTotal(newItemPrice, cartTotal);
  res.send(newCartTotal.toString());
});

app.get('/membership-discount', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let isMember = req.query.isMember;
  let discountedPrice = discountedPriceCalc(cartTotal, isMember);
  res.send(discountedPrice.toString());
});

app.get('/calculate-tax', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let tax = taxCalc(cartTotal);
  res.send(tax.toString());
});

app.get('/estimate-delivery', (req, res) => {
  let shippingMethod = req.query.shippingMethod;
  let distance = parseFloat(req.query.distance);
  let deliveryDays = deliveryDaysCalc(shippingMethod, distance);
  res.send(deliveryDays.toString());
});

app.get('/shipping-cost', (req, res) => {
  let weight = parseFloat(req.query.weight);
  let distance = parseFloat(req.query.distance);
  let shippingCost = shippingCostCalc(weight, distance);
  res.send(shippingCost.toString());
});

app.get('/loyalty-points', (req, res) => {
  let purchaseAmount = parseFloat(req.query.purchaseAmount);
  let loyaltyPoints = loyaltyPointsCalc(purchaseAmount);
  res.send(loyaltyPoints.toString());
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
