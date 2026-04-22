import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import Badge from '../components/Badge';
import ProductCard from '../components/ProductCard';
import SectionDivider from '../components/SectionDivider';
import { productsData } from '../data/productsData';
import { useCartStore } from '../store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Truck, ShieldCheck, RefreshCw, PenTool, Minus, Plus, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const addItem = useCartStore(state => state.addItem);
  
  // Find product
  const product = productsData.find(p => p.id === id) || productsData[0];
  const [selectedSize, setSelectedSize] = useState('10');
  const [activeTab, setActiveTab] = useState('description');
  const [isEngravingOpen, setIsEngravingOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Defaults for production data
  const rating = product.rating || 4.8;
  const reviewsCount = product.reviews || 124;
  const sport = product.sport || (product.categories?.[0]?.split(' > ')[0]) || 'Leagues';
  const year = product.year || product.sku?.slice(-2) || '24';

  const tabs = [
    { id: 'description', label: 'Story & Details' },
    { id: 'specs', label: 'Specifications' },
    { id: 'sizing', label: 'Sizing Guide' },
    { id: 'reviews', label: `Reviews (${reviewsCount})` },
  ];

  return (
    <div className="bg-black min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-8 pt-32 pb-24">
        <Breadcrumb items={[{ name: 'Shop', path: '/shop' }, { name: product.name, path: `/product/${product.id}` }]} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Left: Gallery */}
          <div className="space-y-6">
            <div className="aspect-square bg-surface border border-gold/10 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 gold-glow opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                {product.images?.[activeImageIndex] ? (
                  <motion.img 
                    key={activeImageIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={product.images[activeImageIndex]} 
                    alt={product.name} 
                    className="w-full h-full object-contain p-12"
                  />
                ) : (
                  <svg className="w-64 h-64 text-gold/20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l2.4 7.4h7.6l-6.1 4.5 2.3 7.1-6.2-4.4-6.2 4.4 2.3-7.1-6.1-4.5h7.6z" />
                  </svg>
                )}
                <div className="absolute top-4 right-4 bg-black/60 border border-gold/20 px-3 py-1 font-cinzel text-[10px] text-gold tracking-widest uppercase backdrop-blur-sm">
                  Image {activeImageIndex + 1} of {product.images?.length || 1}
                </div>
              </div>

              {/* Navigation Arrows */}
              {product.images?.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImageIndex(prev => (prev === 0 ? product.images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-gold hover:bg-gold hover:text-black transition-all z-20"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => setActiveImageIndex(prev => (prev === product.images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-gold hover:bg-gold hover:text-black transition-all z-20"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
            
            <div className="grid grid-cols-5 gap-4">
              {product.images?.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveImageIndex(i)}
                  className={`aspect-square bg-surface border transition-all cursor-pointer flex items-center justify-center p-2 ${activeImageIndex === i ? 'border-gold opacity-100 scale-105' : 'border-gold/10 opacity-40 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="flex gap-2 mb-6">
              <Badge variant="sport">{sport}</Badge>
              <Badge variant="gold">{year} Season</Badge>
              {product.isFeatured && <Badge variant="crimson">FEATURED EDITION</Badge>}
            </div>

            <h1 className="text-3xl font-black font-cinzel text-white tracking-widest uppercase mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex text-gold">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} className={i < Math.floor(rating) ? 'fill-gold' : 'opacity-20'} />)}
              </div>
              <span className="text-sm text-ivory/40 font-raleway uppercase tracking-widest">Based on {reviewsCount} Champion Reviews</span>
            </div>

            <div className="flex items-baseline gap-4 mb-12">
              <span className="text-3xl font-mono font-bold text-gold">${product.price.toFixed(2)}</span>
              {product.onSale && (
                <span className="text-xl font-mono text-ivory/30 line-through">${(product.price * 1.5).toFixed(2)}</span>
              )}
            </div>

            <div 
              className="text-ivory/60 font-raleway leading-relaxed mb-12 uppercase text-sm tracking-wide line-clamp-3"
              dangerouslySetInnerHTML={{ __html: product.shortDescription || 'Meticulously handcrafted to match the weight, feel, and radiance of the original ring. Features premium AAA+ cubic zirconia diamonds and 18K gold quadruple plating.' }}
            />

            {/* Customization */}
            <div className="space-y-10 mb-12">
              {/* Ring Size */}
              <div>
                <div className="flex justify-between mb-4">
                  <h3 className="text-xs font-cinzel font-bold text-ivory uppercase tracking-widest">Select Ring Size</h3>
                  <Link to="/size-guide" className="text-[10px] text-gold underline font-cinzel uppercase tracking-widest">Size Guide</Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['7', '8', '9', '10', '11', '12', '13', '14'].map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 flex items-center justify-center font-mono text-sm border transition-all ${selectedSize === size ? 'bg-gold text-black border-gold' : 'border-gold/20 text-ivory/60 hover:border-gold'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Engraving */}
              <div>
                <button 
                  onClick={() => setIsEngravingOpen(!isEngravingOpen)}
                  className="flex items-center gap-3 text- gold-gradient-text font-cinzel text-xs font-bold uppercase tracking-widest"
                >
                  <PenTool size={16} className="text-gold" />
                  {isEngravingOpen ? '- Remove Custom Engraving' : '+ Add Custom Inside Engraving (+$20.00)'}
                </button>
                <AnimatePresence>
                  {isEngravingOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-4"
                    >
                      <input 
                        type="text" 
                        placeholder="NAME, NUMBER, OR DATE (MAX 12 CHARS)" 
                        className="w-full bg-surface border border-gold/30 px-6 py-4 font-cinzel text-[10px] tracking-widest text-gold outline-none focus:border-gold transition-colors"
                        maxLength={12}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-6 mb-12">
              <div className="flex items-center border border-gold/30 h-14">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-6 h-full hover:text-gold transition-colors border-r border-gold/30"><Minus size={16}/></button>
                <span className="px-8 font-mono font-bold text-gold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-6 h-full hover:text-gold transition-colors border-l border-gold/30"><Plus size={16}/></button>
              </div>
              <Button 
                onClick={() => addItem({ ...product, price: isEngravingOpen ? product.price + 20 : product.price })}
                className="flex-1 h-14"
              >
                Add To Collection
              </Button>
              <button 
                onClick={() => toggleWishlist(product)}
                className={`h-14 w-14 border border-gold/30 flex items-center justify-center transition-colors ${isWishlisted(product.id) ? 'bg-gold text-black border-gold' : 'text-gold hover:bg-gold/10'}`}
              >
                <Heart size={24} fill={isWishlisted(product.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Trust Info */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-card border border-gold/10">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck size={20} className="text-gold/60" />
                <span className="text-[9px] uppercase font-cinzel text-ivory/40">Free Fast Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 border-x border-gold/10">
                <ShieldCheck size={20} className="text-gold/60" />
                <span className="text-[9px] uppercase font-cinzel text-ivory/40">Lifetime Authenticity</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RefreshCw size={20} className="text-gold/60" />
                <span className="text-[9px] uppercase font-cinzel text-ivory/40">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Tabs */}
        <section className="mb-24">
          <div className="flex border-b border-gold/10 overflow-x-auto scrollbar-none">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-10 py-6 font-cinzel text-xs tracking-[3px] uppercase whitespace-nowrap transition-colors relative ${activeTab === tab.id ? 'text-gold' : 'text-ivory/40 hover:text-ivory'}`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTab" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-gold" />
                )}
              </button>
            ))}
          </div>
          <div className="py-12 text-ivory/60 font-raleway leading-relaxed text-sm uppercase tracking-wide">
            {activeTab === 'description' && (
              <div className="space-y-6" dangerouslySetInnerHTML={{ __html: product.description }} />
            )}
            {activeTab === 'specs' && (
              <div className="grid grid-cols-2 gap-y-4 max-w-xl">
                <span className="text-gold">Material</span><span>Quadruple 18K Gold Plated Zinc Alloy</span>
                <span className="text-gold">Stones</span><span>AAA+ High-Grade Cubic Zirconia</span>
                <span className="text-gold">Weight</span><span>Approximately 65 grams</span>
                <span className="text-gold">Process</span><span>3D CAD Multi-Layer Plating & Hand Polishing</span>
              </div>
            )}
            {activeTab === 'sizing' && <p>Download our printable ring sizer or measure the diameter of an existing ring. We recommend sizing up if you are between sizes as these rings have a wide band width.</p>}
            {activeTab === 'reviews' && <p>Customer reviews will be displayed here. All our rings have maintained a 4.9/5 star satisfaction rate since 2018.</p>}
          </div>
        </section>

        <SectionDivider />

        {/* Related Products */}
        <section>
          <h2 className="text-2xl font-bold font-cinzel text-gold tracking-widest uppercase mb-12">Complete Your Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {productsData.slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
