import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import api from '../utils/api';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/blog?published=true&limit=50')
      .then(res => { if (res.data.success) setPosts(res.data.data); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="bg-black min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-8 pt-40 pb-24">
        <Breadcrumb items={[{ name: 'Locker Room', path: '/blog' }]} />
        
        <div className="mb-20">
          <h1 className="text-4xl md:text-6xl font-black font-cinzel text-gold tracking-widest uppercase mb-4">Locker Room</h1>
          <p className="text-ivory/40 font-raleway uppercase tracking-[2px] text-xs">Stories, History & News from the World of Champions</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={40} className="text-gold animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-gold/10">
            <p className="font-cinzel text-xl text-ivory/20 uppercase tracking-widest">No articles published yet.</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featured && (
              <div className="mb-24 group relative overflow-hidden border border-gold/10">
                <div className="aspect-[21/9] bg-surface flex items-center justify-center relative overflow-hidden">
                  {featured.coverImage ? (
                    <img src={featured.coverImage} alt={featured.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                  ) : (
                    <div className="absolute inset-0 gold-glow opacity-30 group-hover:opacity-50 transition-opacity" />
                  )}
                  <div className="relative z-10 text-center px-8">
                    <span className="px-4 py-1 bg-gold text-black font-cinzel text-[10px] font-bold uppercase tracking-widest mb-6 inline-block">Featured Story</span>
                    <h2 className="text-3xl md:text-5xl font-black font-cinzel text-white group-hover:text-gold transition-colors max-w-4xl leading-tight uppercase mt-4">
                      {featured.title}
                    </h2>
                  </div>
                </div>
                <div className="p-10 bg-card flex justify-between items-end border-t border-gold/10">
                  <div className="max-w-xl">
                    <p className="text-ivory/60 font-raleway uppercase tracking-wide text-sm leading-relaxed mb-6">{featured.excerpt}</p>
                    <Link to={`/blog/${featured.slug}`} className="text-gold font-cinzel text-xs font-bold uppercase tracking-widest border-b border-gold pb-1 px-1 hover:text-white hover:border-white transition-all">Read Full Story →</Link>
                  </div>
                  <div className="hidden md:block text-right">
                    <p className="text-[10px] text-ivory/40 uppercase tracking-widest mb-1">Written By {featured.author}</p>
                    <p className="text-xs text-gold font-mono uppercase">{new Date(featured.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Post Grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {rest.map(post => (
                  <motion.div key={post.id} whileHover={{ y: -8 }} className="bg-card border border-gold/10 hover:border-gold/30 transition-all flex flex-col group">
                    <div className="aspect-video bg-black flex items-center justify-center border-b border-gold/10 relative overflow-hidden">
                      {post.coverImage ? (
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <>
                          <div className="absolute inset-0 gold-glow opacity-20" />
                          <div className="text-gold/20 font-black font-cinzel text-8xl pointer-events-none select-none">{post.category?.charAt(0)}</div>
                        </>
                      )}
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[9px] text-gold font-cinzel font-bold border border-gold/20 px-2 py-0.5 uppercase tracking-widest">{post.category || 'Article'}</span>
                        <span className="text-[9px] text-ivory/40 font-mono uppercase">{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-xl font-black font-cinzel text-white group-hover:text-gold transition-colors uppercase leading-tight mb-4">{post.title}</h3>
                      <p className="text-xs text-ivory/50 font-raleway leading-relaxed uppercase tracking-wide mb-8 line-clamp-3">{post.excerpt}</p>
                      <Link to={`/blog/${post.slug}`} className="mt-auto text-gold font-cinzel text-[10px] font-bold uppercase tracking-widest hover:translate-x-2 transition-transform inline-block">Read Article →</Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
