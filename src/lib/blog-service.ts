// src/lib/blog-service.ts
export interface Article {
  id: number;
  documentId: string;
  title: string;
  description: string;
  content?: string; // Add content field for rich text
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ArticleResponse {
  data: Article[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    }
  }
}

// Cache for articles to prevent unnecessary API calls
let articlesCache: ArticleResponse | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Fetches all articles from the API
 * Uses a simple in-memory cache to reduce API calls
 */
export async function fetchArticles(): Promise<ArticleResponse> {
  const now = Date.now();
  
  // Return cached data if it's still valid
  if (articlesCache && (now - lastFetchTime < CACHE_DURATION)) {
    return articlesCache;
  }
  
  try {
    const response = await fetch('https://beneficial-health-05fdf4deec.strapiapp.com/api/articles', {
      cache: 'no-store', // Disable caching to always get fresh data
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status}`);
    }

    const data = await response.json();
    
    // Update cache and timestamp
    articlesCache = data;
    lastFetchTime = now;
    
    return data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    // Return empty data structure if fetch fails
    return {
      data: [],
      meta: {
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 0,
          total: 0
        }
      }
    };
  }
}

/**
 * Fetches a single article by its slug
 */
export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  try {
    // First try to find the article in the list
    const articles = await fetchArticles();
    const article = articles.data.find(article => article.slug === slug);
    
    if (!article) {
      return null;
    }
    
    try {
      // Fetch the detailed article with rich text content
      // For Strapi v4, we need to use the documented API format and may need to filter by slug
      const response = await fetch(
        `https://beneficial-health-05fdf4deec.strapiapp.com/api/articles?filters[slug][$eq]=${slug}&populate=*`, 
        {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.warn(`Could not fetch detailed article content, status: ${response.status}`);
        return article; // Return basic article without content
      }

      const data = await response.json();
      
      // Check if we have data and it has the expected structure
      if (data && data.data && data.data.length > 0) {
        const fullArticle = data.data[0];
        const attributes = fullArticle.attributes;
        
        // Look for content field in the attributes
        const richTextContent = attributes.content || '';
        
        // Return enhanced article with content
        return {
          ...article,
          content: richTextContent
        };
      } else {
        console.warn('Unexpected API response structure:', data);
      }
    } catch (contentError) {
      console.error('Error fetching detailed article:', contentError);
      // If fetching detailed content fails, return the basic article
    }
    
    // Return the basic article if we couldn't enhance it with content
    return article;
  } catch (error) {
    console.error(`Error fetching article with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetches the featured article
 * For now, we'll just use the most recently published article as the featured one
 */
export async function fetchFeaturedArticle(): Promise<Article | null> {
  try {
    const response = await fetchArticles();
    
    if (response.data.length === 0) {
      return null;
    }
    
    // Sort articles by publishedAt date (newest first) and return the first one
    const sortedArticles = [...response.data].sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    return sortedArticles[0];
  } catch (error) {
    console.error('Error fetching featured article:', error);
    return null;
  }
}

/**
 * Formats a date string into a readable format
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}