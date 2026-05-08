import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';
import { Search as SearchIcon, X, Loader2 } from 'lucide-react';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    setIsLoading(true);
    setSearched(true);
    try {
      const res = await api.get(`/products?search=${encodeURIComponent(q)}&limit=100&isActive=true`);
      if (res.data.success) setResults(res.data.data);
      else setResults([]);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 400);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  return (
    <div className="bg-black min-h-screen">
      <Header />
      
       <main className="max-w-7xl mx-auto px-8 pt-52 pb-24">
        <div className="max-w-3xl mx-auto mb-20">
           <div className="relative">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SEARCH FOR A CHAMPIONSHIP..." 
                className="w-full bg-surface border-b-2 border-gold/30 px-4 py-8 text-3xl font-black font-cinzel text-gold outline-none focus:border-gold transition-colors placeholder:text-gold/10 uppercase"
                autoFocus
              />
              {isLoading
                ? <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/40 animate-spin" size={28} />
                : <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/20" size={32} />
              }
           </div>
           <p className="text-[10px] text-ivory/40 uppercase tracking-[4px] mt-6 text-center">
              Try: "Super Bowl", "Patriots", "Lakers", "NBA"
           </p>
        </div>

        {searched && (
          <div>
            <div className="flex justify-between items-center mb-12 border-b border-gold/10 pb-6">
               <h2 className="text-sm font-cinzel font-bold text-gold uppercase tracking-widest">
                 {isLoading ? 'Searching...' : `Found ${results.length} Matches`}
               </h2>
               <button onClick={() => { setQuery(''); setResults([]); setSearched(false); }} className="text-[10px] text-ivory/40 hover:text-gold flex items-center gap-2 uppercase tracking-widest transition-colors">
                  <X size={14}/> Clear Search
               </button>
            </div>
            
            {!isLoading && results.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {results.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            {!isLoading && results.length === 0 && (
              <div className="py-24 text-center">
                 <p className="text-ivory/20 font-cinzel text-xl uppercase tracking-widest">No results found in the vault.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Search;
