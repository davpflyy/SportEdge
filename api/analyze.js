// api/analyze.js
export default async function handler(req, res) {
  // Configuración de cabeceras CORS para permitir la conexión desde tu sitio
  res.setHeader('Access-Control-Allow-Origin', 'https://davpflyy.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Responder a la solicitud preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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

    // Enviamos la respuesta con las cabeceras permitidas
    return res.status(200).json(data); 
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor: " + error.message });
  }
}
