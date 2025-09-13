// /api/unsplash.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

console.log("Serverless function loaded")

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("Méthode:", req.method);
  console.log("Clé Unsplash chargée:", process.env.UNSPLASH_ACCESS_KEY ? "OK" : "NON");

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_ACCESS_KEY}`
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Erreur Unsplash API:", response.status, errText);
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();

    res.status(200).json({ photo: data.urls?.regular });
  } catch (err) {
    console.error("Erreur dans la fonction Serverless:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
