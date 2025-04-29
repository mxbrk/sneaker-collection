'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import Link from 'next/link';
import { Article, fetchArticleBySlug, formatDate } from '@/lib/blog-service';

export default function BlogArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const slug = params.slug as string;

  useEffect(() => {
    const getArticle = async () => {
      try {
        setIsLoading(true);
        const foundArticle = await fetchArticleBySlug(slug);
        
        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          setError('Article not found');
        }
      } catch (err) {
        setError('Failed to load article. Please try again later.');
        console.error('Error loading article:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      getArticle();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-[#fafafa] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-[#f5f5f5] rounded-md mb-4 w-3/4 mx-auto"></div>
              <div className="h-4 bg-[#f5f5f5] rounded-md mb-8 w-1/4 mx-auto"></div>
              <div className="h-4 bg-[#f5f5f5] rounded-md mb-2 w-full"></div>
              <div className="h-4 bg-[#f5f5f5] rounded-md mb-2 w-full"></div>
              <div className="h-4 bg-[#f5f5f5] rounded-md mb-4 w-2/3"></div>
              <div className="h-64 bg-[#f5f5f5] rounded-md mb-6"></div>
              <div className="h-4 bg-[#f5f5f5] rounded-md mb-2 w-full"></div>
              <div className="h-4 bg-[#f5f5f5] rounded-md mb-2 w-full"></div>
              <div className="h-4 bg-[#f5f5f5] rounded-md mb-2 w-3/4"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !article) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-[#fafafa] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <div className="bg-white rounded-xl p-10 text-center border border-[#f0f0f0] shadow-sm">
              <div className="mx-auto w-16 h-16 mb-4 text-[#d14124] opacity-70">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-[#171717] mb-2">Article Not Found</h3>
              <p className="text-[#737373] max-w-md mx-auto mb-6">
                {error || "The article you're looking for doesn't exist or has been removed."}
              </p>
              <Link 
                href="/blog" 
                className="inline-flex items-center justify-center px-6 py-3 bg-[#d14124] text-white rounded-lg hover:bg-[#b93a20] transition shadow-sm"
              >
                Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#fafafa]">
        {/* Article Hero */}
        <div className="w-full bg-gradient-to-r from-[#fae5e1] to-white py-16 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 z-0 opacity-20">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path fill="#d14124" d="M42.8,-68.2C56.9,-61.3,70.5,-52.1,78.3,-39.4C86.2,-26.7,88.2,-10.4,84.6,4.3C81.1,19,72,32.2,61.3,41.8C50.6,51.4,38.2,57.3,25.3,60.9C12.3,64.4,-1.2,65.5,-14.3,63.1C-27.4,60.7,-40.1,54.8,-49.4,45.5C-58.7,36.1,-64.5,23.3,-69.1,9.1C-73.8,-5.1,-77.3,-20.6,-71.5,-31.6C-65.8,-42.6,-50.6,-49.2,-36.9,-56C-23.1,-62.9,-11.6,-70,2.2,-73.5C15.9,-77,31.8,-76.9,42.8,-68.2Z" transform="translate(50 50)" />
            </svg>
          </div>
          
          <div className="max-w-4xl mx-auto px-4 relative z-10">
            <div className="mb-4">
              <Link 
                href="/blog"
                className="text-[#737373] hover:text-[#d14124] flex items-center gap-2 mb-6"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Blog
              </Link>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-[#171717] mb-4">
              {article.title}
            </h1>
            
            <div className="flex items-center text-[#737373] mb-4">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#d14124]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(article.publishedAt)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Article Content */}
        <div className="py-12">
          <div className="max-w-3xl mx-auto px-4">
            <div className="bg-white rounded-xl shadow-sm border border-[#f0f0f0] p-8 mb-12">
              <div className="article-content prose max-w-none">
                <p className="text-lg text-[#737373] leading-relaxed mb-6">
                  {article.description}
                </p>
                
                {/* Placeholder for article content since the API doesn't provide the full content */}
                <div className="py-6">
                  <p className="mb-4">
                    This is a placeholder for the article content. Since the API doesn't provide the full content body, 
                    we're showing the article description instead. In a production environment, you would fetch the full 
                    article content and render it here.
                  </p>
                  
                  <p className="mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, 
                    nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, 
                    nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
                  </p>
                  
                  <h2 className="text-2xl font-bold mt-8 mb-4 text-[#171717]">Article Subheading</h2>
                  
                  <p className="mb-4">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                  
                  <ul className="list-disc pl-5 mb-4">
                    <li className="mb-2">Feature point one about sneakers</li>
                    <li className="mb-2">Another interesting fact about collection</li>
                    <li className="mb-2">Tips for keeping your sneakers in good condition</li>
                  </ul>
                  
                  <p>
                    To learn more about the topic, check out our other articles or join our community discussions.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Related Articles Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-[#171717] mb-6">You Might Also Like</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#f0f0f0] hover:shadow-md transition-all duration-300">
                  <div className="p-6">
                    <h4 className="font-bold text-lg mb-2 text-[#171717]">Collection Maintenance Tips</h4>
                    <p className="text-[#737373] mb-4 line-clamp-2">
                      Learn how to keep your sneaker collection in pristine condition with these expert tips.
                    </p>
                    <Link 
                      href="/blog" 
                      className="text-[#d14124] hover:text-[#b93a20] font-medium flex items-center gap-1 text-sm"
                    >
                      <span>Read article</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </Link>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#f0f0f0] hover:shadow-md transition-all duration-300">
                  <div className="p-6">
                    <h4 className="font-bold text-lg mb-2 text-[#171717]">Upcoming Releases</h4>
                    <p className="text-[#737373] mb-4 line-clamp-2">
                      Stay ahead of the game with our guide to the most anticipated sneaker drops this month.
                    </p>
                    <Link 
                      href="/blog" 
                      className="text-[#d14124] hover:text-[#b93a20] font-medium flex items-center gap-1 text-sm"
                    >
                      <span>Read article</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Back to Blog Button */}
            <div className="text-center">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#d14124] text-white rounded-lg hover:bg-[#b93a20] transition-colors shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Back to All Articles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}