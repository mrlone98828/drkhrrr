// netlify/functions/story.js
import fetch from "node-fetch";

export default async (req, res) => {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: "prompt required" }), { status: 400 });
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

    if (!r.ok) {
      const txt = await r.text();
      return new Response(JSON.stringify({ error: "OpenAI error", detail: txt }), { status: 500 });
    }

    const data = await r.json();
    return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });

  } catch (err) {
    return new Response(JSON.stringify({ error: "server error", detail: String(err) }), { status: 500 });
  }
};
