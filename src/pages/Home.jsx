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
      <section className="relative h-screen min-h-[700px] overflow-hidden bg-black">

        {/* Full-bleed animated background layer */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${slide.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {/* Deep sport-color atmosphere */}
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 70% 40%, ${slide.accent}55 0%, ${slide.accent}11 40%, transparent 70%)` }} />
            {/* Dark left vignette for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/20" />
            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />
            {/* Subtle noise/texture overlay */}
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
            {/* Large faded sport icon watermark */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
              <span className="text-[40vw] font-black leading-none opacity-[0.03]">{slide.icon}</span>
            </div>
            {/* Accent color left bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: slide.accent }} />
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="w-full max-w-7xl mx-auto px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

            {/* LEFT — Text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${slide.id}`}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col"
              >
                {/* Slide counter */}
                <div className="flex items-center gap-4 mb-8">
                  <span className="font-cinzel text-gold font-black text-lg leading-none">0{currentSlide + 1}</span>
                  <div className="flex-1 max-w-[80px] h-[1px] bg-gold/20 relative">
                    <motion.div
                      key={currentSlide}
                      className="absolute inset-y-0 left-0 bg-gold"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 5, ease: "linear" }}
                    />
                  </div>
                  <span className="font-cinzel text-white/30 text-sm">0{SLIDES.length}</span>
                </div>

                {/* Badge */}
                <div className="inline-flex items-center gap-3 mb-6 self-start">
                  <div className="w-6 h-[2px]" style={{ background: slide.accent }} />
                  <span className="font-cinzel text-[10px] tracking-[4px] uppercase" style={{ color: slide.accent === '#C9A84C' ? '#C9A84C' : 'rgba(255,255,255,0.7)' }}>{slide.label}</span>
                </div>

                {/* Headline */}
                <h1 className="font-cinzel font-black uppercase leading-[0.88] mb-6">
                  <span className="block text-5xl sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] text-white tracking-tight">{slide.headline}</span>
                  <span className="block text-3xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight mt-1" style={{ WebkitTextStroke: `1px ${slide.accent}`, color: 'transparent' }}>
                    {slide.subheadline}
                  </span>
                </h1>

                {/* Description */}
                <p className="text-white/55 font-raleway text-base lg:text-lg mb-10 leading-relaxed max-w-md">
                  {slide.description}
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-4">
                  <Link to={slide.ctaLink}>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-10 py-4 font-cinzel text-sm font-black uppercase tracking-[3px] text-black transition-all duration-300"
                      style={{ background: slide.accent === '#C9A84C' ? '#C9A84C' : 'linear-gradient(135deg, #C9A84C, #a8843e)' }}
                    >
                      {slide.cta}
                    </motion.button>
                  </Link>
                  <Link to="/shop">
                    <motion.button
                      whileHover={{ scale: 1.03, borderColor: '#C9A84C', color: '#C9A84C' }}
                      whileTap={{ scale: 0.97 }}
                      className="px-10 py-4 font-cinzel text-sm font-black uppercase tracking-[3px] text-white/60 border border-white/20 transition-all duration-300"
                    >
                      Browse All
                    </motion.button>
                  </Link>
                </div>

                {/* Mini stats row */}
                <div className="flex gap-8 mt-12 pt-8 border-t border-white/[0.07]">
                  {[['50K+', 'Rings Delivered'], ['4', 'Major Leagues'], ['1903', 'Season Coverage']].map(([val, label]) => (
                    <div key={label}>
                      <p className="font-cinzel text-gold font-black text-xl leading-none mb-1">{val}</p>
                      <p className="font-raleway text-[9px] text-white/40 uppercase tracking-[2px]">{label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* RIGHT — Ring Image */}
            <div className="hidden lg:flex items-center justify-center relative">
              {/* Glow rings */}
              <div className="absolute w-[500px] h-[500px] rounded-full border border-gold/5" />
              <div className="absolute w-[400px] h-[400px] rounded-full border border-gold/8" />
              <div className="absolute w-[600px] h-[600px] rounded-full"
                style={{ background: `radial-gradient(circle at center, ${slide.accent}22 0%, transparent 65%)` }} />

              <AnimatePresence mode="wait">
                <motion.img
                  key={`ring-${slide.id}`}
                  src={heroRing}
                  alt="Championship Ring"
                  initial={{ opacity: 0, scale: 0.85, rotate: 8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0, y: [0, -18, 0] }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.7, y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" } }}
                  className="relative z-10 w-[380px] xl:w-[480px] drop-shadow-[0_30px_100px_rgba(201,168,76,0.55)] select-none"
                />
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom — slide nav dots */}
        <div className="absolute bottom-8 left-8 lg:left-16 z-20 flex items-center gap-5">
          <button onClick={prevSlide} className="w-10 h-10 border border-white/20 hover:border-gold flex items-center justify-center text-white/40 hover:text-gold transition-all">
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`transition-all duration-400 rounded-full ${i === currentSlide ? 'w-6 h-2 bg-gold' : 'w-2 h-2 bg-white/25 hover:bg-white/50'}`}
              />
            ))}
          </div>
          <button onClick={nextSlide} className="w-10 h-10 border border-white/20 hover:border-gold flex items-center justify-center text-white/40 hover:text-gold transition-all">
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Slide titles - right bottom */}
        <div className="absolute bottom-8 right-8 lg:right-16 z-20 hidden md:flex flex-col items-end gap-1.5">
          {SLIDES.map((s, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)}
              className={`font-cinzel text-[9px] uppercase tracking-[2px] transition-all duration-300 ${i === currentSlide ? 'text-gold' : 'text-white/20 hover:text-white/50'}`}>
              {s.headline}
            </button>
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
