import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Share2, Star, ShieldCheck, Truck, RotateCcw, Minus, Plus, ChevronRight, Loader2 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import Badge from '../components/Badge';
import api from '../utils/api';
import { optimizeImage } from '../utils/imageOptimizer';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/products/${id}`);
        if (mounted && response.data.success) {
          setProduct(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchProduct();
    return () => { mounted = false; };
  }, [id]);

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen text-ivory flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
           <Loader2 size={48} className="text-gold animate-spin mb-4" />
           <p className="font-cinzel text-xs tracking-widest text-gold uppercase">Opening the vault...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-black min-h-screen text-ivory flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-20">
          <h1 className="text-4xl font-cinzel text-gold mb-4">Product Not Found</h1>
          <p className="text-ivory/60 mb-8">The championship ring you are looking for has been moved to the vault.</p>
          <Link to="/shop"><Button variant="primary">Back To Shop</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const price = Number(product.price || 0);
  const salePrice = Number(product.salePrice || 0);
  const onSale = product.onSale && salePrice > 0;
  const rating = product.rating || null;

  const rawStock = product.stockQuantity ?? 999;
  const stock = price === 0 ? 0 : rawStock;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 10;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({ ...product, quantity });
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem({ ...product, quantity });
    navigate('/checkout');
  };
  const images = product.images?.length > 0 ? product.images.map(img => img.url) : [product.image];

  return (
    <div className="bg-black min-h-screen text-ivory">
      <Header />
      
       <main className="max-w-7xl mx-auto px-6 sm:px-8 pt-52 pb-24">
        <Breadcrumb items={[
          { name: 'Shop', path: '/shop' },
          { name: product.name, path: `/product/${product.id}` }
        ]} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-12">
          
          {/* Left: Gallery */}
          <div className="space-y-6">
            <div className="aspect-square bg-card border border-gold/10 overflow-hidden relative group">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  src={optimizeImage(images[selectedImage], { w: 800, h: 800, fit: 'contain' })} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-12"
                  fetchpriority="high"
                  decoding="sync"
                />
              </AnimatePresence>
              <div className="absolute top-6 left-6">
                <Badge variant="gold">Authentic Replica</Badge>
              </div>
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <button 
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square border transition-all ${selectedImage === i ? 'border-gold p-1' : 'border-gold/10 hover:border-gold/30'}`}
                  >
                    <img 
                      src={optimizeImage(img, { w: 150, h: 150, fit: 'contain' })} 
                      alt={`${product.name} ${i}`} 
                      className="w-full h-full object-cover" 
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="border-b border-gold/10 pb-8 mb-8">
               <div className="flex items-center gap-4 mb-4">
                  <span className="text-gold font-cinzel text-[10px] tracking-[3px] uppercase">
                     {product.categories?.[0]?.name || 'Official Collection'}
                  </span>
                  {rating && (
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={i < Math.floor(rating) ? 'fill-gold text-gold' : 'text-gold/20'} />
                      ))}
                      {product.reviews && <span className="text-[10px] text-ivory/40 ml-2 font-mono">({product.reviews} Reviews)</span>}
                    </div>
                  )}
               </div>

               <h1 className="text-3xl md:text-4xl font-black font-cinzel text-white tracking-tight uppercase mb-6 leading-tight">
                 {product.name}
               </h1>

               <div className="flex items-center gap-6">
                 {price === 0 ? (
                   <span className="text-3xl font-cinzel font-bold text-gold tracking-widest uppercase">Coming Soon</span>
                 ) : (
                   <>
                     <span className="text-4xl font-mono font-bold text-gold">${price.toFixed(2)} AUD</span>
                     {onSale && (
                       <span className="text-xl text-ivory/30 line-through font-mono">${salePrice.toFixed(2)} AUD</span>
                     )}
                   </>
                 )}
                 {price > 0 && (
                   <Badge variant={isOutOfStock ? 'crimson' : isLowStock ? 'gold' : 'sport'}>
                     {isOutOfStock ? 'Out of Stock' : isLowStock ? `Only ${stock} left` : 'In Stock'}
                   </Badge>
                 )}
               </div>
            </div>

            <div className="space-y-10">
              {/* Low/Out of Stock Warning */}
              {isOutOfStock && (
                <div className="bg-crimson/10 border border-crimson/40 px-4 py-3 text-crimson font-cinzel text-xs uppercase tracking-widest">
                  ⚠ This product is currently out of stock.
                </div>
              )}
              {isLowStock && (
                <div className="bg-amber-500/10 border border-amber-500/40 px-4 py-3 text-amber-400 font-cinzel text-xs uppercase tracking-widest">
                  ⚡ Low stock — only {stock} remaining. Order soon!
                </div>
              )}

              {/* Short Description */}
              {(product.shortDescription || product.description) && (
                <div
                  className="text-ivory/60 font-raleway leading-relaxed text-base [&_p]:mb-3 [&_strong]:text-gold [&_br]:block"
                  dangerouslySetInnerHTML={{ __html: product.shortDescription || product.description }}
                />
              )}

               <div className="space-y-6">
                {/* Quantity + wishlist row — hidden when price is 0 */}
                {price > 0 && !isOutOfStock && (
                  <div className="flex items-center gap-8">
                   <div className="flex items-center border border-gold/20 bg-card">
                      <button 
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="p-4 transition-colors hover:text-gold"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-mono font-bold">{quantity}</span>
                      <button 
                        disabled={quantity >= stock}
                        onClick={() => setQuantity(q => Math.min(stock, q + 1))}
                        className="p-4 transition-colors hover:text-gold disabled:opacity-20 disabled:cursor-not-allowed"
                      >
                        <Plus size={16} />
                      </button>
                   </div>
                   <button 
                    onClick={() => toggleWishlist(product)}
                    className={`flex items-center gap-2 font-cinzel text-[10px] tracking-widest uppercase transition-colors ${isWishlisted(product.id) ? 'text-gold' : 'text-ivory/40 hover:text-gold'}`}
                   >
                      <Heart size={18} fill={isWishlisted(product.id) ? 'currentColor' : 'none'} /> 
                      {isWishlisted(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                   </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {price === 0 ? (
                    <>
                      <button
                        onClick={() => toggleWishlist(product)}
                        className={`col-span-2 py-5 flex items-center justify-center gap-3 border font-cinzel text-xs uppercase tracking-[3px] font-bold transition-all ${
                          isWishlisted(product.id)
                            ? 'border-gold bg-gold/10 text-gold'
                            : 'border-gold/30 text-ivory/60 hover:border-gold hover:text-gold'
                        }`}
                      >
                        <Heart size={18} fill={isWishlisted(product.id) ? 'currentColor' : 'none'} />
                        {isWishlisted(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                      </button>
                    </>
                  ) : isOutOfStock ? (
                    <>
                      <Button variant="secondary" className="col-span-2 py-6 uppercase tracking-[3px] text-xs font-bold opacity-50 cursor-not-allowed border-crimson/30" disabled>
                        Out of Stock
                      </Button>
                      <button
                        onClick={() => toggleWishlist(product)}
                        className={`col-span-2 py-4 flex items-center justify-center gap-3 border font-cinzel text-xs uppercase tracking-[3px] font-bold transition-all ${
                          isWishlisted(product.id)
                            ? 'border-gold bg-gold/10 text-gold'
                            : 'border-gold/30 text-ivory/60 hover:border-gold hover:text-gold'
                        }`}
                      >
                        <Heart size={18} fill={isWishlisted(product.id) ? 'currentColor' : 'none'} />
                        {isWishlisted(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                      </button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="secondary" 
                        className="w-full py-6 uppercase tracking-[3px] text-xs font-bold border-gold/20 hover:border-gold"
                        onClick={handleAddToCart}
                      >
                        Add To Vault
                      </Button>
                      <Button 
                        variant="primary" 
                        className="w-full py-6 uppercase tracking-[3px] text-xs font-bold"
                        onClick={handleBuyNow}
                      >
                        Direct Purchase
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-gold/10">
                 <div className="flex flex-col items-center text-center gap-2">
                    <Truck className="text-gold" size={24} />
                    <span className="text-[10px] font-cinzel uppercase tracking-widest text-ivory/60">Free Shipping</span>
                 </div>
                 <div className="flex flex-col items-center text-center gap-2">
                    <ShieldCheck className="text-gold" size={24} />
                    <span className="text-[10px] font-cinzel uppercase tracking-widest text-ivory/60">Secure Payment</span>
                 </div>
                 <div className="flex flex-col items-center text-center gap-2">
                    <RotateCcw className="text-gold" size={24} />
                    <span className="text-[10px] font-cinzel uppercase tracking-widest text-ivory/60">30-Day Return</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-32">
           <div className="flex border-b border-gold/10 gap-12 mb-12">
              {['description', 'specifications'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 font-cinzel text-xs tracking-[4px] uppercase transition-all relative ${activeTab === tab ? 'text-gold' : 'text-ivory/30 hover:text-ivory'}`}
                >
                  {tab}
                  {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-gold" />}
                </button>
              ))}
           </div>

           <div className="max-w-4xl min-h-[300px]">
              {activeTab === 'description' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="prose prose-invert max-w-none">
                  {product.description ? (
                    <div
                      className="text-ivory/70 leading-loose font-raleway text-base [&_p]:mb-4 [&_strong]:text-gold [&_br]:block"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  ) : (
                    <p className="text-ivory/40 font-cinzel text-xs uppercase tracking-widest">No description available.</p>
                  )}
                </motion.div>
              )}

              {activeTab === 'specifications' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    product.sku && { label: 'SKU', value: product.sku },
                    product.categories?.[0] && { label: 'Category', value: product.categories[0].name || product.categories[0] },
                    product.stockQuantity !== undefined && { label: 'Stock', value: product.stockQuantity === 0 ? 'Out of Stock' : `${product.stockQuantity} units` },
                    product.status && { label: 'Status', value: product.status },
                  ].filter(Boolean).map(spec => (
                    <div key={spec.label} className="flex justify-between items-center py-4 border-b border-gold/5">
                      <span className="text-[10px] font-cinzel text-ivory/40 uppercase tracking-widest">{spec.label}</span>
                      <span className="text-sm font-raleway text-white">{spec.value}</span>
                    </div>
                  ))}
                  {product.shortDescription && (
                    <div className="col-span-2 pt-4">
                      <div
                        className="text-ivory/60 font-raleway text-sm leading-relaxed [&_p]:mb-3 [&_strong]:text-gold"
                        dangerouslySetInnerHTML={{ __html: product.shortDescription }}
                      />
                    </div>
                  )}
                </motion.div>
              )}

           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
