import { SneakerApiResponse } from '@/types/sneakers';

// In src/lib/sneaker-service.ts, modify the fetchSneakersData function:

export const fetchSneakersData = async (
  query: string, 
  showKidsShoes: boolean = true,
  genderFilter: string = 'both'
): Promise<SneakerApiResponse> => {
  if (!query || query.trim() === '') {
    return { total: 0, page: 1, pages: 0, data: [] };
  }

  console.log(`Fetching sneakers with query: ${query}, showKidsShoes: ${showKidsShoes}, genderFilter: ${genderFilter}`);

  const options: RequestInit = {
    method: 'GET',
    headers: {
      Authorization: process.env.NEXT_PUBLIC_SNEAKERS_API_KEY || '',
    },
    next: { revalidate: 3600 },
  };

  try {
    // If filtering, fetch more items initially to compensate for filtered results
    const limit = (!showKidsShoes || genderFilter !== 'both') ? 36 : 12;
    
    const response = await fetch(
      `https://api.sneakersapi.dev/api/v3/stockx/products?category=sneakers&query=${encodeURIComponent(query)}&limit=${limit}`, 
      options
    );

    if (!response.ok) {
      throw new Error('Error fetching data');
    }

    const data: SneakerApiResponse = await response.json();   
    console.log(`Received ${data.data?.length || 0} results from API`);
    
    let filteredData = data.data || [];
    
    // Filter out kids' shoes if needed
    if (!showKidsShoes && filteredData.length > 0) {
      const kidsKeywords = [
        'GS', 'PS', 'TD', 'INFANT', 'TODDLER', 'PRESCHOOL', 
        'KIDS', 'CHILD', 'CHILDREN', 'YOUTH', 'LITTLE', 'BABY',
        ' C)', ' C ', '(C)', 'GRADE SCHOOL'
      ];
      
      filteredData = filteredData.filter(sneaker => {
        const title = sneaker.title ? sneaker.title.toUpperCase() : '';
        const colorway = sneaker.colorway ? sneaker.colorway.toUpperCase() : '';
        const sku = sneaker.sku ? sneaker.sku.toUpperCase() : '';
        
        const isKidsShoe = kidsKeywords.some(keyword => 
          title.includes(keyword) || 
          colorway.includes(keyword) || 
          sku.includes(keyword)
        );
        
        if (isKidsShoe) {
          console.log(`Filtered out kids shoe: "${sneaker.title}"`);
        }
        
        return !isKidsShoe;
      });
      
      console.log(`After kids filtering: ${filteredData.length} results kept`);
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
      
      filteredData = filteredData.filter(sneaker => {
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
          console.log(`Filtered out ${isWomensShoe ? "women's" : "men's"} shoe: "${sneaker.title}"`);
        }
        
        return genderFilter === 'women' ? isWomensShoe : isMensShoe;
      });
      
      console.log(`After gender filtering: ${filteredData.length} results kept`);
    }
    
    // Limit to 12 results for display
    const limitedData = filteredData.slice(0, 12);
    
    // Return filtered data with updated counts
    return {
      ...data,
      data: limitedData,
      total: filteredData.length,
    };
  } catch (err) {
    console.error('Error:', err);
    return { total: 0, page: 1, pages: 0, data: [] };
  }
};