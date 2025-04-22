import { SneakerApiResponse, Sneaker, GoatSneaker } from '@/types/sneakers';

export const fetchSneakersData = async (
  query: string, 
  showKidsShoes: boolean = true,
  genderFilter: string = 'both'
): Promise<SneakerApiResponse> => {
  if (!query || query.trim() === '') {
    return { total: 0, page: 1, pages: 0, data: [] };
  }

  console.log(`Fetching sneakers with query: ${query}, showKidsShoes: ${showKidsShoes}, genderFilter: ${genderFilter}`);

  try {
    // Verwende deinen eigenen API-Endpunkt statt der direkten Sneakers API
    const response = await fetch(
      `/api/sneakers?query=${encodeURIComponent(query)}&limit=12`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error fetching data: ${response.status}, ${errorText}`);
      throw new Error(`Error fetching data: ${errorText}`);
    }

    const apiResponse = await response.json();
    console.log(`Received ${apiResponse.data?.length || 0} results from API`);
    
    // Transform the GOAT API response to match our application's expected format
    const transformedData = apiResponse.data ? apiResponse.data.map((item: GoatSneaker) => ({
      id: item.id.toString(),
      title: item.name,
      sku: item.sku || '',
      brand: item.brand,
      colorway: item.colorway || '',
      image: item.image_url,
      retailPrice: item.retail_prices?.retail_price_cents_usd 
        ? Math.round(item.retail_prices.retail_price_cents_usd / 100) 
        : null,
      releaseDate: item.release_date ? formatReleaseDate(item.release_date) : null,
      model: item.model || '',
      description: item.description || '',
    })) : [];
    
    let filteredData = transformedData || [];
    
    // Filter out kids' shoes if needed
    if (!showKidsShoes && filteredData.length > 0) {
      const kidsKeywords = [
        'GS', 'PS', 'TD', 'INFANT', 'TODDLER', 'PRESCHOOL', 
        'KIDS', 'CHILD', 'CHILDREN', 'YOUTH', 'LITTLE', 'BABY',
        ' C)', ' C ', '(C)', 'GRADE SCHOOL'
      ];
      
      filteredData = filteredData.filter((sneaker: Sneaker) => {
        const title = sneaker.title ? sneaker.title.toUpperCase() : '';
        const colorway = sneaker.colorway ? sneaker.colorway.toUpperCase() : '';
        const sku = sneaker.sku ? sneaker.sku.toUpperCase() : '';
        
        const isKidsShoe = kidsKeywords.some(keyword => 
          title.includes(keyword) || 
          colorway.includes(keyword) || 
          sku.includes(keyword)
        );
        
        if (isKidsShoe) {
        }
        
        return !isKidsShoe;
      });
      
    }
    
    // Filter by gender if needed
    if (genderFilter !== 'both' && filteredData.length > 0) {
      // Keywords that indicate women's shoes
      const womensKeywords = [
        'WMNS', 'WOMEN', 'WOMENS', 'W)', '(W)', ' W ', 'WOMAN', 'LADIES', 'FEMALE'
      ];
      
      // Keywords that indicate men's shoes
      const mensKeywords = [
        'MENS', 'MEN', 'MAN', 'M)', '(M)', ' M '
      ];
      
      filteredData = filteredData.filter((sneaker: Sneaker) => {
        const title = sneaker.title ? sneaker.title.toUpperCase() : '';
        const colorway = sneaker.colorway ? sneaker.colorway.toUpperCase() : '';
        const sku = sneaker.sku ? sneaker.sku.toUpperCase() : '';
        
        const isWomensShoe = womensKeywords.some(keyword => 
          title.includes(keyword) || 
          colorway.includes(keyword) || 
          sku.includes(keyword)
        );
        
        const isMensShoe = !isWomensShoe && (mensKeywords.some(keyword => 
          title.includes(keyword) || 
          colorway.includes(keyword) || 
          sku.includes(keyword)
        ) || (!womensKeywords.some(keyword => 
          title.includes(keyword) || 
          colorway.includes(keyword) || 
          sku.includes(keyword)
        )));
        
        // For debugging
        if ((genderFilter === 'women' && !isWomensShoe) || (genderFilter === 'men' && !isMensShoe)) {
        }
        
        return genderFilter === 'women' ? isWomensShoe : isMensShoe;
      });
      
    }
    
    // Limit to 12 results for display
    const limitedData = filteredData.slice(0, 12);
    
    // Return filtered data with updated counts
    return {
      total: filteredData.length,
      page: apiResponse.meta?.current_page || 1,
      pages: Math.ceil(filteredData.length / 12),
      data: limitedData,
    };
  } catch (err) {
    console.error('Error:', err);
    return { total: 0, page: 1, pages: 0, data: [] };
  }
};

// Helper function to format release date from YYYYMMDD to YYYY-MM-DD
function formatReleaseDate(dateString: string): string {
  if (!dateString || dateString.length !== 8) return '';
  
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  
  return `${year}-${month}-${day}`;
}