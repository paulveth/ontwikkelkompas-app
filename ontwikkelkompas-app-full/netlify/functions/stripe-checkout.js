const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
exports.handler = async () => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: { currency: "eur", product_data: { name: "Toegang tot AI-dagschema's" }, unit_amount: 500 },
      quantity: 1,
    }],
    mode: "payment",
    success_url: `${process.env.URL}/?success=true`,
    cancel_url: `${process.env.URL}/?canceled=true`,
  });
  return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
};