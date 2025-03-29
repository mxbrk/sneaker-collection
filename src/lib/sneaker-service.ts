import { SneakerApiResponse } from '@/types/sneakers';

export const fetchSneakersData = async (query: string, showKidsShoes: boolean = true): Promise<SneakerApiResponse> => {
  if (!query || query.trim() === '') {
    return { total: 0, page: 1, pages: 0, data: [] };
  }

  console.log(`Fetching sneakers with query: ${query}, showKidsShoes: ${showKidsShoes}`);

  const options: RequestInit = {
    method: 'GET',
    headers: {
      Authorization: process.env.NEXT_PUBLIC_SNEAKERS_API_KEY || '',
    },
    next: { revalidate: 3600 },
  };

  try {
    // If not showing kids shoes, fetch more items initially (36 instead of 12)
    // This gives us a buffer to filter out kids' shoes but still show a full page
    const limit = !showKidsShoes ? 36 : 12;
    
    const response = await fetch(
      `https://api.sneakersapi.dev/api/v3/stockx/products?category=sneakers&query=${encodeURIComponent(query)}&limit=${limit}`, 
      options
    );

    if (!response.ok) {
      throw new Error('Error fetching data');
    }

    const data: SneakerApiResponse = await response.json();   
    console.log(`Received ${data.data?.length || 0} results from API`);
    
    // If showKidsShoes is false, filter the results to exclude kids' shoes
    if (!showKidsShoes && data.data && data.data.length > 0) {
      // Keywords that indicate kids' shoes - expanded list for better coverage
      const kidsKeywords = [
        'GS', 'PS', 'TD', 'INFANT', 'TODDLER', 'PRESCHOOL', 
        'KIDS', 'CHILD', 'CHILDREN', 'YOUTH', 'LITTLE', 'BABY',
        ' C)', ' C ', '(C)', 'GRADE SCHOOL'
      ];
      
      // Filter the data
      const filteredData = data.data.filter(sneaker => {
        // Convert title and colorway to uppercase for case-insensitive comparison
        const title = sneaker.title ? sneaker.title.toUpperCase() : '';
        const colorway = sneaker.colorway ? sneaker.colorway.toUpperCase() : '';
        const sku = sneaker.sku ? sneaker.sku.toUpperCase() : '';
        
        // Check if any kids' keywords are in the title, colorway, or SKU
        const isKidsShoe = kidsKeywords.some(keyword => 
          title.includes(keyword) || 
          colorway.includes(keyword) || 
          sku.includes(keyword)
        );
        
        // For debugging
        if (isKidsShoe) {
          console.log(`Filtered out kids shoe: "${sneaker.title}"`);
        }
        
        // Return true to keep sneakers that are NOT kids' shoes
        return !isKidsShoe;
      });
      
      console.log(`After filtering: ${filteredData.length} of ${data.data.length} results kept`);
      
      // Limit to 12 results for display
      const limitedData = filteredData.slice(0, 12);
      
      // Return filtered data with updated counts
      return {
        ...data,
        data: limitedData,
        total: filteredData.length, // Keep the total count accurate
      };
    }
    
    return data;
  } catch (err) {
    console.error('Error:', err);
    // Return empty response in case of error
    return { total: 0, page: 1, pages: 0, data: [] };
  }
};