export interface Article {
  id: number;
  documentId: string;
  title: string;
  description: string;
  content?: string;
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
    };
  };
}

interface RichTextBlock {
  __component: "shared.rich-text";
  body: string;
}

interface Block {
  __component: string;
  body?: string;
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
  if (articlesCache && now - lastFetchTime < CACHE_DURATION) {
    return articlesCache;
  }

  try {
    const response = await fetch(
      "https://beneficial-health-05fdf4deec.strapiapp.com/api/articles?populate=*",
      {
        cache: "no-store", // Disable caching to always get fresh data
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status}`);
    }

    const data = await response.json();

    // Update cache and timestamp
    articlesCache = data;
    lastFetchTime = now;

    return data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    // Return empty data structure if fetch fails
    return {
      data: [],
      meta: {
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 0,
          total: 0,
        },
      },
    };
  }
}

/**
 * Fetches a single article by its slug
 */
export async function fetchArticleBySlug(
  slug: string
): Promise<Article | null> {
  try {
    const response = await fetch(
      `https://beneficial-health-05fdf4deec.strapiapp.com/api/articles?filters[slug][$eq]=${slug}&populate=*`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.warn(
        `Could not fetch detailed article content, status: ${response.status}`
      );
      return null;
    }

    const data = await response.json();

    if (data && data.data && data.data.length > 0) {
      const fullArticle = data.data[0];
      const attributes = fullArticle;

      // Extrahiere Inhalte aus dem Block (z. B. nur rich-text)
      let content = "";
      if (attributes.blocks && Array.isArray(attributes.blocks)) {
        const richTextBlocks = (attributes.blocks as Block[]).filter(
          (block) => block.__component === "shared.rich-text" && block.body
        );

        content = richTextBlocks
          .map((block: any) => `<p>${block.body}</p>`)
          .join("\n");
      }

      return {
        id: attributes.id,
        documentId: attributes.documentId,
        title: attributes.title,
        description: attributes.description,
        slug: attributes.slug,
        createdAt: attributes.createdAt,
        updatedAt: attributes.updatedAt,
        publishedAt: attributes.publishedAt,
        content,
      };
    }

    return null;
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
    const sortedArticles = [...response.data].sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return sortedArticles[0];
  } catch (error) {
    console.error("Error fetching featured article:", error);
    return null;
  }
}

/**
 * Formats a date string into a readable format
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}
