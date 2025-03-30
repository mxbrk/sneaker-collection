// src/app/profile/statistics/StatisticsPage.tsx
'use client';

import MainLayout from '@/components/MainLayout';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface CollectionItem {
  id: string;
  sneakerId: string;
  sku: string;
  brand: string;
  title: string;
  colorway: string;
  image: string | null;
  sizeUS: string;
  sizeEU: string | null;
  sizeUK: string | null;
  condition: string;
  purchaseDate: string | null;
  retailPrice: number | null;
  purchasePrice: number | null;
  notes: string | null;
  labels: string[];
  createdAt: string;
  updatedAt: string;
}

// Type for brand distribution data
interface BrandData {
  name: string;
  value: number;
}

// Type for price range distribution data
interface PriceRangeData {
  range: string;
  count: number;
}

// Type for condition distribution data
interface ConditionData {
  condition: string;
  count: number;
}

// Type for monthly spending data
interface MonthlySpendingData {
  month: string;
  spending: number;
  count: number;
}

// Type for size distribution data
interface SizeData {
  size: string;
  count: number;
}

export default function StatisticsPage() {
  const router = useRouter();
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Stats data
  const [brandDistribution, setBrandDistribution] = useState<BrandData[]>([]);
  const [priceRangeDistribution, setPriceRangeDistribution] = useState<PriceRangeData[]>([]);
  const [conditionDistribution, setConditionDistribution] = useState<ConditionData[]>([]);
  const [monthlySpending, setMonthlySpending] = useState<MonthlySpendingData[]>([]);
  const [sizeDistribution, setSizeDistribution] = useState<SizeData[]>([]);

  // Colors for charts
  const COLORS = ['#d14124', '#e87a64', '#f0a58c', '#f8c9bd', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6'];

  useEffect(() => {
    fetchCollection();
  }, []);

  const fetchCollection = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/collection');
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch collection data');
      }

      const data = await response.json();
      const collectionData = data.collection || [];
      setCollection(collectionData);
      
      // Process data for statistics
      processBrandDistribution(collectionData);
      processPriceRangeDistribution(collectionData);
      processConditionDistribution(collectionData);
      processMonthlySpending(collectionData);
      processSizeDistribution(collectionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Process brand distribution
  const processBrandDistribution = (data: CollectionItem[]) => {
    const brandCounts: Record<string, number> = {};
    
    data.forEach(item => {
      brandCounts[item.brand] = (brandCounts[item.brand] || 0) + 1;
    });
    
    const brandData = Object.entries(brandCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    
    setBrandDistribution(brandData);
  };

  // Process price range distribution
  const processPriceRangeDistribution = (data: CollectionItem[]) => {
    const priceRanges = [
      { min: 0, max: 100, label: '$0-100' },
      { min: 100, max: 200, label: '$100-200' },
      { min: 200, max: 300, label: '$200-300' },
      { min: 300, max: 500, label: '$300-500' },
      { min: 500, max: Infinity, label: '$500+' }
    ];
    
    const rangeCounts: Record<string, number> = {};
    priceRanges.forEach(range => {
      rangeCounts[range.label] = 0;
    });
    
    data.forEach(item => {
      if (item.purchasePrice !== null) {
        const range = priceRanges.find(r => 
          item.purchasePrice! >= r.min && item.purchasePrice! < r.max
        );
        
        if (range) {
          rangeCounts[range.label]++;
        }
      }
    });
    
    const priceRangeData = Object.entries(rangeCounts)
      .map(([range, count]) => ({ range, count }))
      .filter(item => item.count > 0);
    
    setPriceRangeDistribution(priceRangeData);
  };

  // Process condition distribution
  const processConditionDistribution = (data: CollectionItem[]) => {
    const conditionCounts: Record<string, number> = {};
    
    data.forEach(item => {
      conditionCounts[item.condition] = (conditionCounts[item.condition] || 0) + 1;
    });
    
    // Map condition values to more readable labels
    const conditionMapping: Record<string, string> = {
      'DS': 'Deadstock',
      'VNDS': 'Very Near DS',
      '10': '10 - Like new',
      '9': '9 - Excellent',
      '8': '8 - Great',
      '7': '7 - Good',
      '6': '6 - Acceptable',
      '5': '5 - Worn',
      '4': '4 - Very worn',
      '3': '3 - Heavily worn',
      '2': '2 - Poor',
      '1': '1 - Very poor',
    };
    
    const conditionData = Object.entries(conditionCounts)
      .map(([condition, count]) => ({ 
        condition: conditionMapping[condition] || condition, 
        count 
      }))
      .sort((a, b) => {
        // Sort by numeric condition if possible
        const aNum = parseInt(a.condition.split(' ')[0], 10);
        const bNum = parseInt(b.condition.split(' ')[0], 10);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return bNum - aNum; // Descending order
        }
        
        // Special sorting for DS and VNDS
        if (a.condition === 'Deadstock') return -1;
        if (b.condition === 'Deadstock') return 1;
        if (a.condition === 'Very Near DS') return -1;
        if (b.condition === 'Very Near DS') return 1;
        
        return a.condition.localeCompare(b.condition);
      });
    
    setConditionDistribution(conditionData);
  };
  
  // Process monthly spending
  const processMonthlySpending = (data: CollectionItem[]) => {
    const monthlyData: Record<string, { spending: number, count: number }> = {};
    
    // Create last 12 months
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = date.toLocaleString('en-US', { month: 'short', year: '2-digit' });
      monthlyData[monthKey] = { spending: 0, count: 0 };
    }
    
    data.forEach(item => {
      if (item.purchaseDate && item.purchasePrice !== null) {
        const purchaseDate = new Date(item.purchaseDate);
        const monthKey = purchaseDate.toLocaleString('en-US', { month: 'short', year: '2-digit' });
        
        // Only include if within last 12 months
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].spending += item.purchasePrice;
          monthlyData[monthKey].count += 1;
        }
      }
    });
    
    // Convert to array and reverse to get chronological order
    const monthlySpendingData = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        spending: data.spending,
        count: data.count
      }))
      .reverse();
    
    setMonthlySpending(monthlySpendingData);
  };

  // Process size distribution
  const processSizeDistribution = (data: CollectionItem[]) => {
    const sizeCounts: Record<string, number> = {};
    
    data.forEach(item => {
      const size = `US ${item.sizeUS}`;
      sizeCounts[size] = (sizeCounts[size] || 0) + 1;
    });
    
    const sizeData = Object.entries(sizeCounts)
      .map(([size, count]) => ({ size, count }))
      .sort((a, b) => {
        const aSize = parseFloat(a.size.replace('US ', ''));
        const bSize = parseFloat(b.size.replace('US ', ''));
        return aSize - bSize;
      });
    
    setSizeDistribution(sizeData);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#d14124] border-r-transparent"></div>
          <p className="mt-2 text-[#737373]">Loading collection statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#fafafa] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Link 
            href="/profile"
            className="text-[#737373] hover:text-[#d14124] flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Profile
          </Link>
          
          <h1 className="text-3xl font-bold text-[#171717] mt-4 mb-8">Collection Statistics</h1>

          {collection.length === 0 ? (
            <div className="bg-white border border-dashed border-[#e5e5e5] rounded-xl p-10 text-center">
              <div className="mx-auto w-16 h-16 mb-4 text-[#d14124] opacity-70">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-[#171717] mb-2">Your collection is empty</h3>
              <p className="text-[#737373] max-w-md mx-auto mb-6">Start building your sneaker collection by searching for your favorite kicks and adding them to see statistics.</p>
              <Link href="/search" className="inline-flex items-center justify-center px-6 py-3 bg-[#d14124] text-white rounded-lg hover:bg-[#b93a20] transition shadow-sm">
                Find Sneakers
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Collection Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f0f0f0]">
                  <h3 className="text-[#737373] font-medium mb-2">Total Sneakers</h3>
                  <p className="text-3xl font-bold text-[#171717]">{collection.length}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f0f0f0]">
                  <h3 className="text-[#737373] font-medium mb-2">Total Value</h3>
                  <p className="text-3xl font-bold text-[#171717]">
                    {formatCurrency(collection.reduce((sum, item) => sum + (item.purchasePrice || 0), 0))}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f0f0f0]">
                  <h3 className="text-[#737373] font-medium mb-2">Average Price</h3>
                  <p className="text-3xl font-bold text-[#171717]">
                    {formatCurrency(collection.reduce((sum, item) => sum + (item.purchasePrice || 0), 0) / (collection.length || 1))}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f0f0f0]">
                  <h3 className="text-[#737373] font-medium mb-2">Unique Brands</h3>
                  <p className="text-3xl font-bold text-[#171717]">
                    {new Set(collection.map(item => item.brand)).size}
                  </p>
                </div>
              </div>

              {/* Brand Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f0f0f0]">
                  <h3 className="text-xl font-medium text-[#171717] mb-4">Brand Distribution</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={brandDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }: {name: string, percent: number}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {brandDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${value} sneakers`, 'Count']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Price Range Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f0f0f0]">
                  <h3 className="text-xl font-medium text-[#171717] mb-4">Price Range Distribution</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={priceRangeDistribution}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => [`${value} sneakers`, 'Count']} />
                        <Bar dataKey="count" name="Sneakers" fill="#d14124" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Monthly Spending and Size Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Spending */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f0f0f0]">
                  <h3 className="text-xl font-medium text-[#171717] mb-4">Monthly Spending (Last 12 Months)</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlySpending}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" orientation="left" stroke="#d14124" />
                        <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                        <Tooltip formatter={(value: number, name: string) => [
                          name === 'spending' ? formatCurrency(value as number) : value,
                          name === 'spending' ? 'Spending' : 'Sneakers Purchased'
                        ]} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="spending" name="Spending" fill="#d14124" />
                        <Bar yAxisId="right" dataKey="count" name="Sneakers Purchased" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Size Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f0f0f0]">
                  <h3 className="text-xl font-medium text-[#171717] mb-4">Size Distribution</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={sizeDistribution}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="size" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => [`${value} sneakers`, 'Count']} />
                        <Bar dataKey="count" name="Sneakers" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Condition Distribution */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f0f0f0]">
                <h3 className="text-xl font-medium text-[#171717] mb-4">Condition Distribution</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={conditionDistribution}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="condition" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => [`${value} sneakers`, 'Count']} />
                      <Bar dataKey="count" name="Sneakers" fill="#f59e0b">
                        {conditionDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}