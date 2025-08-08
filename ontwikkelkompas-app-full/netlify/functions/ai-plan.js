const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
exports.handler = async (event) => {
  const { prompt } = JSON.parse(event.body || "{}");
  if (!prompt) return { statusCode: 400, body: JSON.stringify({ error: "No prompt" }) };
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4",
  });
  const content = completion.choices[0].message.content || "";
  const plan = content.split("\n").filter(Boolean);
  return { statusCode: 200, body: JSON.stringify({ plan }) };
};