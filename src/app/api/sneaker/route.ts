// pages/api/sneaker.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { productId } = req.query;  // id wird hier von der Anfrage übergeben
  const apiKey = process.env.SNEAKERS_API_KEY; // Keep this as is, but now it will be loaded from .env // API-Key aus Umgebungsvariablen

  if (!apiKey) {
    return res.status(400).json({ error: 'API-Key fehlt.' });
  }

  if (!productId) {
    return res.status(400).json({ error: 'Produkt-ID fehlt.' });
  }

  try {
    // URL für den Produkts-Endpoint nach der API-Dokumentation
    const response = await fetch(`https://api.sneakersapi.dev/v3/stockx/products/${productId}`, {
      method: 'GET',
      headers: {
        'Authorization': apiKey, // API-Schlüssel ohne Prefix wie Bearer
        'Host': 'api.sneakersapi.dev', // Host-Header
      },
    });

    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Sneaker-Daten');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fehler bei der API-Anfrage' });
  }
}
