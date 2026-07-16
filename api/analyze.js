// api/analyze.js
export default async function handler(req, res) {
  // Aseguramos que solo aceptamos peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { prompt } = req.body;
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || 'Error al conectar con OpenRouter' });
    }

    // Aquí enviamos exactamente lo que el frontend espera
    return res.status(200).json(data); 
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor: " + error.message });
  }
}
