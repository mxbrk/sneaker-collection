import Link from 'next/link';
import Image from 'next/image';
import { Article, formatDate, getArticleCoverUrl } from '@/lib/blog-service';

interface FeaturedArticleProps {
  article: Article;
}

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  const coverUrl = getArticleCoverUrl(article);
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md border border-[#f0f0f0] transition-all duration-300 hover:shadow-lg">
      <div className="grid md:grid-cols-5">
        {/* Left Column - Image or Color */}
        <div className="md:col-span-2 relative">
          {coverUrl ? (
            <div className="h-full min-h-[240px]">
              <Image
                src={coverUrl}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-full min-h-[240px] bg-gradient-to-br from-[#d14124] to-[#fae5e1] flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 opacity-80">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Content Column */}
        <div className="p-8 md:col-span-3">
          <div className="flex items-center flex-wrap gap-2 mb-4">
            {/* Date Badge */}
            <div className="inline-block px-3 py-1 rounded-full bg-[#fae5e1] text-[#d14124] text-xs font-medium">
              {formatDate(article.publishedAt)}
            </div>
            
            {/* Category Badge - if available */}
            {article.category && (
              <div className="inline-block px-3 py-1 rounded-full bg-[#f0f0f0] text-[#737373] text-xs font-medium">
                {article.category.name}
              </div>
            )}
          </div>
          
          <h3 className="text-2xl font-bold text-[#171717] mb-4">{article.title}</h3>
          <p className="text-[#737373] mb-6 line-clamp-3">{article.description}</p>
          
          {/* Author - if available */}
          {article.author && (
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 rounded-full bg-[#fae5e1] flex items-center justify-center text-[#d14124] font-medium mr-2">
                {article.author.name.charAt(0)}
              </div>
              <span className="text-sm text-[#737373]">{article.author.name}</span>
            </div>
          )}
          
          <Link 
            href={`/blog/${article.slug}`} 
            className="inline-flex items-center px-4 py-2 bg-[#d14124] text-white rounded-lg hover:bg-[#b93a20] transition-colors text-sm font-medium"
          >
            <span>Read Article</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}