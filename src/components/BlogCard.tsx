// src/components/BlogCard.tsx
import Link from 'next/link';
import { Article, formatDate } from '@/lib/blog-service';

interface BlogCardProps {
  article: Article;
}

export default function BlogCard({ article }: BlogCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#f0f0f0] hover:shadow-md transition-all duration-300 h-full flex flex-col">
      {/* Card Top Color Accent */}
      <div className="h-2 bg-gradient-to-r from-[#d14124] to-[#fae5e1]"></div>
      
      <div className="p-6 flex flex-col flex-grow">
        {/* Date Badge */}
        <div className="inline-block px-3 py-1 rounded-full bg-[#fae5e1] text-[#d14124] text-xs font-medium mb-4">
          {formatDate(article.publishedAt)}
        </div>
        
        {/* Title */}
        <Link href={`/blog/${article.slug}`}>
          <h3 className="text-xl font-bold text-[#171717] mb-3 line-clamp-2 hover:text-[#d14124] transition-colors">
            {article.title}
          </h3>
        </Link>
        
        {/* Description */}
        <p className="text-[#737373] mb-6 flex-grow line-clamp-3">
          {article.description}
        </p>
        
        {/* Read More Link */}
        <Link 
          href={`/blog/${article.slug}`} 
          className="text-[#d14124] hover:text-[#b93a20] font-medium flex items-center gap-1 mt-auto text-sm"
        >
          <span>Read more</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}