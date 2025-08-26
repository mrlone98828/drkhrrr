// netlify/functions/story.js
exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Method not allowed" })
      };
    }

    const { prompt } = JSON.parse(event.body || "{}");
    if (!prompt) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "prompt required" })
      };
    }

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: [
          { role: "system", content: "Te egy magyar nyelvű, atmoszférikus horror novellista vagy." },
          { role: "user", content: prompt }
        ],
        temperature: 0.9,
        max_output_tokens: 650
      })
    });

    const text = await r.text(); // továbbítjuk nyersen (JSON)
    return {
      statusCode: r.ok ? 200 : 500,
      headers: { "Content-Type": "application/json" },
      body: text
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "server error", detail: String(err) })
    };
  }
};