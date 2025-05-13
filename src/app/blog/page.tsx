'use client';

import MainLayout from "@/components/MainLayout";
import { useState, useEffect } from "react";
import Link from "next/link";

// Grundlegende Artikel-Struktur
interface Article {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  author: string;
}

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    const placeholderArticles: Article[] = [
      {
        title: "Article-Placeholder",
        description: "This is a placeholder for an article. Will be replaced later by real articles.no articles available yet",
        slug: "article-placeholder",
        publishedAt: new Date().toISOString(),
        author: "Max B."
      }
    ];
    
    // Verzögerung simulieren
    setTimeout(() => {
      setArticles(placeholderArticles);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-white to-[#fafafa] min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 pt-10 pb-8 sm:pt-12 sm:pb-10 relative z-10">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-[#171717] mb-3 tracking-tight">
                <span className="inline-block">SoleUp</span>
                <span className="text-[#d14124]"> Blog</span>
              </h1>
              <p className="text-base text-[#737373] max-w-2xl mx-auto mb-5">
                Your source for sneaker culture and the latest industry trends.
              </p>
              <div className="w-16 h-1 bg-[#d14124] mx-auto mb-6 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Hauptinhalt - wird später durch ContentLayer-Inhalte gefüllt */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-[#171717]">
              Newest articles
            </h2>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#d14124] border-r-transparent"></div>
              <p className="mt-4 text-[#737373]">Loading articles...</p>
            </div>
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-[#f0f0f0] p-6">
                  <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                  <p className="text-[#737373] mb-4">{article.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-[#d14124]">{new Date(article.publishedAt).toLocaleDateString()}</p>
                  <p className="text-sm text-[#737373]">{article.author}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-[#737373]">No articles available yet.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}