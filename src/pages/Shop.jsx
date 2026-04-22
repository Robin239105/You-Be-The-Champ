import React, { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { productsData } from '../data/productsData';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react';

const Shop = () => {
  const [selectedSports, setSelectedSports] = useState([]);
  const [selectedEras, setSelectedEras] = useState([]);
  const [sortBy, setSortBy] = useState('Featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const ITEMS_PER_PAGE = 20;

  const sports = ['NFL', 'NBA', 'NHL', 'MLB', 'Special Edition'];
  const eras = [
    { label: '1960s', range: [1960, 1969] },
    { label: '1970s', range: [1970, 1979] },
    { label: '1980s', range: [1980, 1989] },
    { label: '1990s', range: [1990, 1999] },
    { label: '2000s', range: [2000, 2009] },
    { label: '2010s', range: [2010, 2019] },
    { label: '2020s', range: [2020, 2029] },
  ];

  // Lock scroll when mobile filter is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileFilterOpen]);

  const filteredProducts = useMemo(() => {
    let result = [...productsData];

    if (selectedSports.length > 0) {
      result = result.filter(p => {
        return p.categories?.some(cat => {
          const lowerCat = cat.toLowerCase();
          return selectedSports.some(sport => lowerCat.includes(sport.toLowerCase()));
        });
      });
    }

    if (selectedEras.length > 0) {
      result = result.filter(p => {
        const yearCat = p.categories?.find(cat => cat.startsWith('Champions By Year >'));
        if (!yearCat) return false;
        const yearMatch = yearCat.match(/\d{4}/);
        const year = yearMatch ? parseInt(yearMatch[0]) : null;
        if (!year) return false;
        return selectedEras.some(eraLabel => {
          const era = eras.find(e => e.label === eraLabel);
          return era && year >= era.range[0] && year <= era.range[1];
        });
      });
    }

    if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Newest Arrivals') {
      result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }

    return result;
  }, [selectedSports, selectedEras, sortBy]);

  const toggleSport = (sport) => {
    setSelectedSports(prev => prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]);
    setCurrentPage(1);
  };

  const toggleEra = (era) => {
    setSelectedEras(prev => prev.includes(era) ? prev.filter(e => e !== era) : [...prev, era]);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedSports([]);
    setSelectedEras([]);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const FilterContent = () => (
    <>
      <div className="flex items-center justify-between mb-10">
        <h3 className="font-cinzel text-sm font-bold text-gold tracking-widest uppercase">Filters</h3>
        {(selectedSports.length > 0 || selectedEras.length > 0) && (
          <button onClick={clearFilters} className="text-[10px] text-ivory/40 hover:text-gold uppercase tracking-widest transition-colors">Clear All</button>
        )}
      </div>

      <div className="space-y-12">
        <div>
          <h3 className="font-cinzel text-[10px] font-bold text-ivory/40 tracking-[3px] mb-6 uppercase">By Sport</h3>
          <div className="space-y-4">
            {sports.map(sport => (
              <button 
                key={sport} 
                onClick={() => toggleSport(sport)}
                className="flex items-center gap-3 group w-full text-left"
              >
                <div className={`w-5 h-5 border transition-all flex items-center justify-center ${selectedSports.includes(sport) ? 'border-gold bg-gold/10' : 'border-gold/20 group-hover:border-gold/50'}`}>
                  {selectedSports.includes(sport) && <div className="w-2 h-2 bg-gold" />}
                </div>
                <span className={`text-xs uppercase tracking-widest transition-colors ${selectedSports.includes(sport) ? 'text-gold' : 'text-ivory/60 group-hover:text-ivory'}`}>{sport}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-cinzel text-[10px] font-bold text-ivory/40 tracking-[3px] mb-6 uppercase">By Era</h3>
          <div className="grid grid-cols-2 gap-2">
            {eras.map(era => (
              <button 
                key={era.label} 
                onClick={() => toggleEra(era.label)}
                className={`px-3 py-3 border text-[10px] font-cinzel transition-all uppercase tracking-widest ${selectedEras.includes(era.label) ? 'bg-gold text-black border-gold' : 'bg-card border-gold/10 text-ivory/50 hover:border-gold/40'}`}
              >
                {era.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-gold/10">
          <div className="bg-gold/5 p-6 border border-gold/10">
            <p className="text-[10px] text-gold font-cinzel tracking-widest uppercase leading-relaxed text-center">
              All our rings are crafted from premium zinc alloy with quadruple 18K gold plating.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="bg-black min-h-screen">
      <Header />
      
      {/* Mobile Sticky Filter Bar */}
      <div className="lg:hidden sticky top-20 z-40 bg-black/80 backdrop-blur-md border-b border-gold/10 px-6 py-4 flex items-center justify-between">
         <button 
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center gap-2 text-gold font-cinzel text-[10px] font-bold tracking-widest uppercase"
         >
            <SlidersHorizontal size={14} />
            Filter { (selectedSports.length + selectedEras.length) > 0 && `(${selectedSports.length + selectedEras.length})` }
         </button>
         <div className="h-4 w-[1px] bg-gold/20" />
         <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-gold font-cinzel text-[10px] font-bold tracking-widest uppercase outline-none"
          >
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
      </div>

      {/* Small Hero */}
      <div className="pt-40 pb-20 px-8 text-center bg-surface relative overflow-hidden">
        <div className="absolute inset-0 gold-glow opacity-30" />
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black font-cinzel text-gold tracking-widest uppercase relative z-10"
        >
          The Archive
        </motion.h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 flex flex-col lg:flex-row gap-12 relative">
        {/* Desktop Sidebar (Sticky) */}
        <aside className="hidden lg:block w-72 h-fit sticky top-32">
          <FilterContent />
        </aside>

        {/* Product Grid Area */}
        <main className="flex-1">
          <div className="hidden lg:flex flex-row items-center justify-between mb-12 border-b border-gold/10 pb-6 gap-4">
            <p className="text-xs text-ivory/40 uppercase tracking-[2px] font-raleway">
              Showing <span className="text-gold font-bold">{filteredProducts.length}</span> Results
            </p>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-black border border-gold/20 font-cinzel text-[10px] py-2 px-4 text-gold outline-none focus:border-gold uppercase tracking-widest appearance-none cursor-pointer hover:bg-gold/5 transition-colors"
            >
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 min-h-[600px]">
            <AnimatePresence mode="popLayout">
              {paginatedProducts.map(product => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={product.id}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="font-cinzel text-ivory/40 uppercase tracking-[4px]">No rings found matching these filters</p>
                <button onClick={clearFilters} className="mt-6 text-gold underline text-xs font-cinzel tracking-widest uppercase">Reset All Filters</button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-20 flex justify-center items-center gap-4">
              <button 
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage(prev => Math.max(1, prev - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-3 border font-cinzel text-[10px] tracking-widest uppercase transition-all ${currentPage === 1 ? 'border-gold/5 text-ivory/10 cursor-not-allowed' : 'border-gold/20 text-gold hover:bg-gold/10'}`}
              >
                Prev
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-10 h-10 border font-cinzel text-[10px] transition-all ${currentPage === pageNum ? 'bg-gold text-black border-gold' : 'border-gold/10 text-ivory/40 hover:border-gold/40'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button 
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage(prev => Math.min(totalPages, prev + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-3 border font-cinzel text-[10px] tracking-widest uppercase transition-all ${currentPage === totalPages ? 'border-gold/5 text-ivory/10 cursor-not-allowed' : 'border-gold/20 text-gold hover:bg-gold/10'}`}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-card border-l border-gold/20 z-[70] p-8 overflow-y-auto"
            >
              <div className="flex justify-end mb-8">
                <button onClick={() => setIsMobileFilterOpen(false)} className="text-gold p-2">
                  <X size={24} />
                </button>
              </div>
              <FilterContent />
              <div className="mt-12 sticky bottom-0 pt-6 bg-card border-t border-gold/10">
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full bg-gold text-black py-4 font-cinzel font-bold text-xs tracking-widest uppercase"
                >
                  Show {filteredProducts.length} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Shop;
