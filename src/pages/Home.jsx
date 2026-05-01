import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Trophy, Search, Package, Truck, Calendar } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import Marquee from '../components/Marquee';
import StatsBanner from '../components/StatsBanner';
import NewsletterSection from '../components/NewsletterSection';
import api from '../utils/api';
import heroRing from '../assets/hero-ring.png';

const SLIDES = [
  {
    id: 1,
    tag: "New Arrival",
    headline: "Dodgers",
    sub: "World Series Ring",
    description: "The LA Dodgers championship ring — crafted for true collectors.",
    cta: "Shop Dodgers",
    ctaLink: "/category/Teams%20%3E%20Los%20Angeles%20Dodgers%20(MLB)",
    sport: "MLB",
  },
  {
    id: 2,
    tag: "Just Dropped",
    headline: "OKC Thunder",
    sub: "Championship Ring",
    description: "Oklahoma City's finest — own the moment with the OKC ring.",
    cta: "Shop OKC",
    ctaLink: "/category/Teams%20%3E%20Oklahoma%20City%20Thunder%20(NBA)",
    sport: "NBA",
  },
  {
    id: 3,
    tag: "Iconic Moment",
    headline: "Seattle",
    sub: "Super Bowl Ring",
    description: "Relive Seattle's greatest Super Bowl victory. The Seahawks championship replica.",
    cta: "Shop Seahawks",
    ctaLink: "/category/Teams%20%3E%20Seattle%20Seahawks%20(NFL)",
    sport: "NFL",
  },
  {
    id: 4,
    tag: "Dynasty",
    headline: "Panthers",
    sub: "Back to Back",
    description: "Two rings. One dynasty. Carolina Panthers back-to-back champions.",
    cta: "Shop Panthers",
    ctaLink: "/category/Teams%20%3E%20Carolina%20Panthers%20(NFL)",
    sport: "NFL",
  },
  {
    id: 5,
    tag: "Own Every Ring",
    headline: "Own The",
    sub: "Moment",
    description: "Every ring. Every legend. Every championship — in your collection.",
    cta: "Shop All",
    ctaLink: "/shop",
    sport: "ALL",
  },
];

const LEAGUES = [
  { name: "NFL", icon: "🏈", label: "National Football League", path: "League > NFL - National Football League", color: "#013369" },
  { name: "NBA", icon: "🏀", label: "National Basketball Association", path: "League > NBA - National Basketball Association", color: "#C9002B" },
  { name: "MLB", icon: "⚾", label: "Major League Baseball", path: "League > MLB - Major League Baseball", color: "#002D72" },
  { name: "NHL", icon: "🏒", label: "National Hockey League", path: "League > NHL - National Hockey League", color: "#111111" },
];

const VALUE_PROPS = [
  { icon: Trophy, title: "Championship Quality", desc: "Precision-crafted replicas built to collector standards" },
  { icon: Search, title: "Collector's Detail", desc: "Every stone, engraving and finish faithfully reproduced" },
  { icon: Package, title: "Every Ring Available", desc: "The largest championship ring catalog in the world" },
  { icon: Truck, title: "Free Shipping", desc: "Free shipping on every single order, no minimum" },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);

  const nextSlide = useCallback(() => setCurrentSlide(s => (s + 1) % SLIDES.length), []);
  const prevSlide = useCallback(() => setCurrentSlide(s => (s - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  useEffect(() => {
    api.get('/products?limit=9&isActive=true').then(res => {
      if (res.data.success) setProducts(res.data.data.slice(0, 9));
    }).catch(() => {});
    api.get('/blog?published=true&limit=3').then(res => {
      if (res.data.success) setBlogPosts(res.data.data);
    }).catch(() => {});
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <div className="bg-black min-h-screen text-ivory selection:bg-gold selection:text-black">
      <Header />

      {/* ── SECTION 1: HERO SLIDER ── */}
      <section className="relative w-full overflow-hidden bg-[#0a0a0a]" style={{ height: '100svh', minHeight: 640 }}>

        {/* ── Static gold background grid lines (luxury texture) ── */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }} />

        {/* ── Gold radial glow center-right ── */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 72% 50%, rgba(201,168,76,0.12) 0%, transparent 70%)' }} />

        {/* ── Bottom fade into next section ── */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />

        {/* ── Slide content ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center"
          >
            <div className="relative z-10 w-full h-full flex items-center">
              <div className="w-full max-w-7xl mx-auto px-8 xl:px-16 flex flex-col lg:flex-row items-center gap-0 lg:gap-16 h-full pt-24">

                {/* ── LEFT: Text ── */}
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-1 flex flex-col justify-center z-10 py-16"
                >
                  {/* Tag */}
                  <div className="flex items-center gap-3 mb-7">
                    <span className="block w-8 h-px bg-gold" />
                    <span className="font-cinzel text-gold text-[10px] uppercase tracking-[5px]">{slide.tag}</span>
                    <span className="font-cinzel text-white/20 text-[9px] uppercase tracking-[3px] border border-white/10 px-2 py-0.5">{slide.sport}</span>
                  </div>

                  {/* Headline */}
                  <h1 className="font-cinzel font-black uppercase leading-[0.85] mb-5 tracking-tight">
                    <span className="block text-white" style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)' }}>
                      {slide.headline}
                    </span>
                    <span className="block gold-gradient-text" style={{ fontSize: 'clamp(2rem, 5.5vw, 5rem)' }}>
                      {slide.sub}
                    </span>
                  </h1>

                  {/* Divider */}
                  <div className="w-16 h-px bg-gold/40 mb-6" />

                  {/* Description */}
                  <p className="text-white/50 font-raleway text-base leading-relaxed mb-10 max-w-sm">
                    {slide.description}
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-4 mb-14">
                    <Link to={slide.ctaLink}>
                      <motion.span
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 bg-gold text-black font-cinzel text-xs font-black uppercase tracking-[3px] px-9 py-4 cursor-pointer"
                      >
                        {slide.cta}
                        <ChevronRight size={14} />
                      </motion.span>
                    </Link>
                    <Link to="/shop">
                      <motion.span
                        whileHover={{ scale: 1.02, color: '#C9A84C' }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 border border-white/20 hover:border-gold/60 text-white/60 hover:text-gold font-cinzel text-xs uppercase tracking-[3px] px-9 py-4 cursor-pointer transition-all duration-300"
                      >
                        Browse All
                      </motion.span>
                    </Link>
                  </div>

                  {/* Stats strip */}
                  <div className="flex gap-10">
                    {[['50K+', 'Rings Delivered'], ['4', 'Major Leagues'], ['120+', 'Years of History']].map(([n, l]) => (
                      <div key={l} className="flex flex-col">
                        <span className="font-cinzel text-gold font-black text-2xl leading-none">{n}</span>
                        <span className="font-raleway text-[9px] text-white/35 uppercase tracking-[2px] mt-1">{l}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* ── RIGHT: Ring ── */}
                <div className="flex-1 hidden lg:flex items-center justify-center relative h-full">
                  {/* Outer glow */}
                  <div className="absolute w-[560px] h-[560px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 65%)' }} />
                  {/* Concentric circles */}
                  <div className="absolute w-[420px] h-[420px] rounded-full border border-gold/8 pointer-events-none" />
                  <div className="absolute w-[320px] h-[320px] rounded-full border border-gold/12 pointer-events-none" />

                  <motion.img
                    key={`ring-${slide.id}`}
                    src={heroRing}
                    alt="Championship Ring"
                    initial={{ opacity: 0, scale: 0.88, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: [0, -16, 0] }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      opacity: { duration: 0.6 },
                      scale: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                      y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }
                    }}
                    className="relative z-10 w-[400px] xl:w-[500px] 2xl:w-[560px] select-none object-contain"
                    style={{ filter: 'drop-shadow(0 24px 80px rgba(201,168,76,0.5)) drop-shadow(0 4px 20px rgba(0,0,0,0.9))' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Slide navigation — vertical right strip ── */}
        <div className="absolute right-8 xl:right-12 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-3">
          {SLIDES.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className="group flex items-center gap-3 justify-end"
            >
              <span className={`font-cinzel text-[9px] uppercase tracking-[2px] transition-all duration-300 ${i === currentSlide ? 'text-gold' : 'text-white/20 group-hover:text-white/50'}`}>
                {s.headline}
              </span>
              <div className={`transition-all duration-300 rounded-full flex-shrink-0 ${i === currentSlide ? 'w-2 h-6 bg-gold' : 'w-1.5 h-1.5 bg-white/20 group-hover:bg-white/50'}`} />
            </button>
          ))}
        </div>

        {/* ── Bottom controls ── */}
        <div className="absolute bottom-10 left-8 xl:left-16 z-20 flex items-center gap-4">
          <button
            onClick={prevSlide}
            className="w-11 h-11 border border-white/15 hover:border-gold/60 flex items-center justify-center text-white/40 hover:text-gold transition-all duration-300"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)} className="relative flex items-center justify-center w-6 h-6">
                <span className={`block rounded-full transition-all duration-300 ${i === currentSlide ? 'w-5 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/50'}`} />
              </button>
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="w-11 h-11 border border-white/15 hover:border-gold/60 flex items-center justify-center text-white/40 hover:text-gold transition-all duration-300"
          >
            <ChevronRight size={18} />
          </button>

          {/* Slide counter */}
          <span className="font-cinzel text-white/25 text-[10px] tracking-[3px] ml-2">
            0{currentSlide + 1} <span className="text-white/10">/ 0{SLIDES.length}</span>
          </span>
        </div>

        {/* Auto-play progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-20">
          <motion.div
            key={currentSlide}
            className="h-full bg-gold/60"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: 'linear' }}
          />
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <Marquee />

      {/* ── SECTION 2: SHOP BY LEAGUE ── */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-gold font-cinzel text-[10px] tracking-[4px] uppercase block mb-3">Browse by Sport</span>
          <h2 className="text-4xl font-black font-cinzel tracking-widest text-white uppercase">Shop by League</h2>
          <div className="w-20 h-[2px] bg-gold mx-auto mt-5" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {LEAGUES.map((league) => (
            <Link
              key={league.name}
              to={`/category/${encodeURIComponent(league.path)}`}
              className="group relative flex flex-col items-center justify-center gap-5 p-10 border border-gold/10 hover:border-gold/50 bg-white/[0.02] hover:bg-gold/5 transition-all duration-300 text-center overflow-hidden hover:shadow-[0_0_30px_rgba(201,168,76,0.12)]"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at center, ${league.color}22 0%, transparent 70%)` }} />
              <span className="text-5xl transition-transform duration-300 group-hover:scale-110 relative z-10">{league.icon}</span>
              <div className="relative z-10">
                <p className="font-cinzel text-white font-black text-2xl uppercase tracking-[3px] group-hover:text-gold transition-colors">{league.name}</p>
                <p className="text-white/40 font-raleway text-[10px] uppercase tracking-widest mt-1">{league.label}</p>
              </div>
              <div className="w-0 group-hover:w-12 h-[1px] bg-gold transition-all duration-500 relative z-10" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: CHAMPIONSHIP COLLECTION ── */}
      <section className="py-24 px-8 bg-white/[0.01] border-y border-gold/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-gold font-cinzel text-[10px] tracking-[4px] uppercase block mb-3">Most Popular</span>
            <h2 className="text-4xl font-black font-cinzel tracking-widest text-white uppercase">Championship Collection</h2>
            <div className="w-20 h-[2px] bg-gold mx-auto mt-5" />
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-white/[0.03] border border-gold/5 animate-pulse" />
              ))}
            </div>
          )}
          <div className="mt-14 text-center">
            <Link to="/shop"><Button variant="outline" className="px-16 py-4 tracking-[3px]">View Full Collection</Button></Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <StatsBanner />

      {/* ── SECTION 4: BLOG / NEWS FEED ── */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-gold font-cinzel text-[10px] tracking-[4px] uppercase block mb-3">Latest Updates</span>
          <h2 className="text-4xl font-black font-cinzel tracking-widest text-white uppercase">News & Blog</h2>
          <div className="w-20 h-[2px] bg-gold mx-auto mt-5" />
        </div>
        {blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`}
                className="group flex flex-col border border-gold/10 hover:border-gold/40 bg-white/[0.02] hover:bg-gold/5 transition-all duration-300 overflow-hidden">
                {post.featuredImage ? (
                  <div className="aspect-video overflow-hidden">
                    <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-gold/10 to-black flex items-center justify-center">
                    <span className="text-4xl">🏆</span>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-gold/60 font-cinzel text-[9px] tracking-[2px] uppercase mb-3">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Latest'}
                  </p>
                  <h3 className="font-cinzel text-white font-black text-sm uppercase tracking-[1px] group-hover:text-gold transition-colors mb-3 leading-snug flex-1">{post.title}</h3>
                  {post.excerpt && <p className="text-white/50 font-raleway text-xs leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>}
                  <span className="text-gold font-cinzel text-[9px] uppercase tracking-widest group-hover:translate-x-1 transition-transform inline-block">Read More →</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-gold/10 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-gold/10 to-black flex items-center justify-center">
                  <span className="text-4xl opacity-30">🏆</span>
                </div>
                <div className="p-6">
                  <div className="h-3 bg-white/5 rounded mb-3 w-1/3" />
                  <div className="h-4 bg-white/5 rounded mb-2" />
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-12 text-center">
          <Link to="/blog"><Button variant="outline" className="px-16 py-4 tracking-[3px]">All Articles</Button></Link>
        </div>
      </section>

      {/* ── PRE-FOOTER: VALUE PROPS ── */}
      <section className="border-t border-gold/10 bg-white/[0.015]">
        <div className="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {VALUE_PROPS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 border border-gold/20 flex items-center justify-center group hover:border-gold transition-all hover:shadow-[0_0_16px_rgba(201,168,76,0.2)]">
                <Icon size={26} className="text-gold" />
              </div>
              <div>
                <h4 className="font-cinzel text-white font-black text-sm uppercase tracking-[2px] mb-2">{title}</h4>
                <p className="text-white/50 font-raleway text-xs leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <NewsletterSection />

      <Footer />
    </div>
  );
};

export default Home;
