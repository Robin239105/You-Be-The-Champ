import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import { placeholderPosts } from '../data/placeholderPosts';
import { useLocation } from 'react-router-dom';

const BlogPost = () => {
  const { slug } = useParams();
  const post = placeholderPosts.find(p => p.slug === slug) || placeholderPosts[0];

  return (
    <div className="bg-black min-h-screen">
      <Header />
      
      <main className="max-w-4xl mx-auto px-8 pt-40 pb-24">
        <Breadcrumb items={[{ name: 'The Locker Room', path: '/blog' }, { name: 'Post', path: `/blog/${post.slug}` }]} />
        
        <header className="mb-16">
           <div className="flex items-center gap-4 mb-6">
              <span className="text-gold font-cinzel text-xs font-bold tracking-widest uppercase border border-gold/30 px-3 py-1">{post.category}</span>
              <span className="text-ivory/40 font-mono text-[10px] uppercase">{post.date}</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-black font-cinzel text-white tracking-widest uppercase leading-tight mb-8 drop-shadow-[0_0_15px_rgba(201,168,76,0.2)]">
              {post.title}
           </h1>
           <div className="flex items-center gap-4 py-8 border-y border-gold/10">
              <div className="w-10 h-10 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center font-cinzel text-gold text-sm">{post.author.charAt(0)}</div>
              <div>
                 <p className="text-[10px] text-ivory/40 uppercase tracking-widest">Authored by</p>
                 <p className="text-xs text-ivory font-bold uppercase">{post.author} • Head Historian</p>
              </div>
           </div>
        </header>

        <div className="aspect-[21/9] bg-surface border border-gold/10 flex items-center justify-center mb-16 relative overflow-hidden group">
           <div className="absolute inset-0 gold-glow opacity-30" />
           <p className="text-gold/20 font-black font-cinzel text-9xl transform -rotate-6 select-none group-hover:scale-110 transition-transform duration-700">LEGACY</p>
        </div>

        <article className="prose prose-invert max-w-none text-ivory/70 font-raleway leading-loose text-lg uppercase tracking-wide space-y-8">
           <p className="first-letter:text-7xl first-letter:font-cinzel first-letter:text-gold first-letter:float-left first-letter:mr-4 first-letter:mt-1">
              Every championship ring tells a story that transcends the regular season and the grueling playoffs. It is the physical manifestation of blood, sweat, and absolute dedication to the sport. 
           </p>
           
           <h2 className="text-2xl font-black font-cinzel text-gold uppercase tracking-widest pt-8 border-b border-gold/10 pb-4">The Craftsmanship Gap</h2>
           <p>
              Many fans ask what makes a "Player Edition" ring special compared to standard souvenir shop versions. The answer lies in the weight. A true championship ring replica should feel substantial on the finger, weighing between 60 and 80 grams of solid alloy and triple-plated precious metals.
           </p>
           
           <blockquote className="border-l-4 border-gold p-8 bg-card italic text-white text-2xl font-cinzel">
              "When you put it on, it feels like history. That is the feeling we aim to preserve at You Be The Champ."
           </blockquote>

           <p>
              Our historians collaborate with master jewelers to verify every facet, engraving, and stone placement against the original trophy pieces. It's a meticulous process that ensures your collection is a worthy tribute to the legends who earned the gold.
           </p>
        </article>

        <section className="mt-24 pt-16 border-t border-gold/10 flex justify-between items-center">
           <Link to="/blog" className="text-gold font-cinzel text-xs font-bold uppercase tracking-widest hover:translate-x-[-4px] transition-transform">← Archive</Link>
           <div className="flex gap-4">
              <span className="text-[10px] text-ivory/40 uppercase tracking-widest self-center">Share This Legacy</span>
              <div className="flex gap-2">
                 <div className="w-8 h-8 rounded-full border border-gold/20 hover:bg-gold hover:text-black transition-all flex items-center justify-center cursor-pointer">f</div>
                 <div className="w-8 h-8 rounded-full border border-gold/20 hover:bg-gold hover:text-black transition-all flex items-center justify-center cursor-pointer">t</div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
