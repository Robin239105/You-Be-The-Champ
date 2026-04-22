import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import ProductCard from '../components/ProductCard';
import { useWishlistStore } from '../store/useWishlistStore';
import { Share2, Heart, ShoppingBag } from 'lucide-react';
import Button from '../components/Button';

const Wishlist = () => {
  const { items } = useWishlistStore();

  return (
    <div className="bg-black min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-8 pt-40 pb-24">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
           <div>
              <Breadcrumb items={[{ name: 'Wishlist', path: '/wishlist' }]} />
              <h1 className="text-4xl font-black font-cinzel text-gold tracking-widest uppercase">The Vault</h1>
              <p className="text-[10px] text-ivory/40 uppercase tracking-[2px] mt-2">Your Saved Championship Rings</p>
           </div>
           {items.length > 0 && (
             <button className="flex items-center gap-2 text-gold text-[10px] font-cinzel border border-gold/20 px-4 py-2 hover:bg-gold hover:text-black transition-all uppercase tracking-widest">
                <Share2 size={14} /> Share Wishlist
             </button>
           )}
        </div>

        {items.length === 0 ? (
          <div className="py-24 text-center bg-card border border-gold/10 p-12">
            <Heart className="text-gold/20 mx-auto mb-6" size={64} />
            <h2 className="text-xl font-cinzel text-ivory mb-4 uppercase tracking-widest">Your vault is currently empty</h2>
            <p className="text-ivory/40 font-raleway text-xs uppercase tracking-widest mb-8">Mark your favorite rings with a heart to see them here.</p>
            <div className="flex justify-center gap-4">
               <a href="/shop"><Button>Browse Collection</Button></a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
