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
    label: "New Arrival",
    headline: "Dodgers",
    subheadline: "World Series Ring",
    description: "The LA Dodgers championship ring — crafted for true collectors.",
    cta: "Shop Dodgers",
    ctaLink: "/category/Teams%20%3E%20Los%20Angeles%20Dodgers%20(MLB)",
    accent: "#005A9C",
    icon: "⚾",
  },
  {
    id: 2,
    label: "Just Dropped",
    headline: "OKC Thunder",
    subheadline: "Championship Ring",
    description: "Oklahoma City's finest — own the moment with the OKC ring.",
    cta: "Shop OKC",
    ctaLink: "/category/Teams%20%3E%20Oklahoma%20City%20Thunder%20(NBA)",
    accent: "#007AC1",
    icon: "🏀",
  },
  {
    id: 3,
    label: "Iconic Moment",
    headline: "Seattle",
    subheadline: "Super Bowl Ring",
    description: "Relive Seattle's greatest victory. The Seahawks championship replica.",
    cta: "Shop Seahawks",
    ctaLink: "/category/Teams%20%3E%20Seattle%20Seahawks%20(NFL)",
    accent: "#002244",
    icon: "🏈",
  },
  {
    id: 4,
    label: "Dynasty",
    headline: "Panthers",
    subheadline: "Back to Back",
    description: "Two rings. One dynasty. Carolina Panthers back-to-back champions.",
    cta: "Shop Panthers",
    ctaLink: "/category/Teams%20%3E%20Carolina%20Panthers%20(NFL)",
    accent: "#0085CA",
    icon: "🏆",
  },
  {
    id: 5,
    label: "Brand",
    headline: "Own The",
    subheadline: "Moment",
    description: "Every ring. Every legend. Every championship — in your collection.",
    cta: "Shop All",
    ctaLink: "/shop",
    accent: "#C9A84C",
    icon: "💍",
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
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 flex items-center"
          >
            {/* Background radial accent */}
            <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 65% 50%, ${slide.accent}33 0%, transparent 65%)` }} />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none select-none">
              <span className="text-[22vw] font-black font-cinzel text-white/[0.025] tracking-tight uppercase leading-none pr-8">{slide.icon}</span>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-3 bg-gold/10 border border-gold/20 px-4 py-1.5 mb-8"
                >
                  <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                  <span className="text-gold font-cinzel text-[10px] tracking-[3px] uppercase">{slide.label}</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-cinzel font-black uppercase leading-none mb-4"
                >
                  <span className="block text-6xl md:text-8xl text-white">{slide.headline}</span>
                  <span className="block text-4xl md:text-6xl gold-gradient-text mt-2">{slide.subheadline}</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/60 font-raleway text-lg mb-10 leading-relaxed"
                >
                  {slide.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-4"
                >
                  <Link to={slide.ctaLink}>
                    <Button variant="primary" className="px-10 py-4 text-sm tracking-[2px]">{slide.cta}</Button>
                  </Link>
                  <Link to="/shop">
                    <Button variant="secondary" className="px-10 py-4 text-sm tracking-[2px] border-white/20 hover:border-gold">Browse All</Button>
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Ring visual right side */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center pointer-events-none">
              <motion.img
                key={slide.id}
                src={heroRing}
                alt="Championship Ring"
                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                animate={{ opacity: 0.9, scale: 1, rotate: 0, y: [0, -15, 0] }}
                transition={{ duration: 0.8, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
                className="w-[400px] md:w-[520px] drop-shadow-[0_20px_80px_rgba(201,168,76,0.5)]"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slider Controls */}
        <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-gold/30 hover:border-gold flex items-center justify-center text-gold/60 hover:text-gold transition-all bg-black/40 backdrop-blur-sm">
          <ChevronLeft size={20} />
        </button>
        <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-gold/30 hover:border-gold flex items-center justify-center text-gold/60 hover:text-gold transition-all bg-black/40 backdrop-blur-sm">
          <ChevronRight size={20} />
        </button>

        {/* Slide dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`transition-all duration-300 ${i === currentSlide ? 'w-8 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'}`}
            />
          ))}
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
