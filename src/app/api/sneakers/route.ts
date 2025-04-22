// src/app/api/sneakers/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Extrahiere die Suchanfrage aus den URL-Parametern
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || '';
  const limit = searchParams.get('limit') || '12';
  
  // Nur weitermachen, wenn eine Suchanfrage vorhanden ist
  if (!query) {
    return NextResponse.json({ total: 0, page: 1, pages: 0, data: [] });
  }
  
  try {
    // Anfrage an die externe API mit deinem API-Key
    const options = {
      method: 'GET',
      headers: {
        'Authorization': process.env.SNEAKERS_API_KEY || '', // Beachte: kein NEXT_PUBLIC_
      },
    };
    
    const apiUrl = `https://api.sneakersapi.dev/api/v3/goat/products?query=${encodeURIComponent(query)}&limit=${limit}`;
    
    console.log('Sending request to Sneakers API from server');
    const response = await fetch(apiUrl, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error: ${response.status}, ${errorText}`);
      return NextResponse.json(
        { error: `API responded with status ${response.status}: ${errorText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Sneakers API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Sneakers API' },
      { status: 500 }
    );
  }
}