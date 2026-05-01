import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Trophy, Search, Package, Truck, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import Marquee from '../components/Marquee';
import StatsBanner from '../components/StatsBanner';
import NewsletterSection from '../components/NewsletterSection';
import api from '../utils/api';

const SLIDES = [
  {
    id: 1,
    tag: "New Arrival · 2024",
    headline: "Los Angeles",
    sub: "Dodgers",
    label: "World Series Ring",
    description: "The 2024 World Series. LA's finest — a precision-crafted replica for true collectors.",
    cta: "Shop Dodgers Rings",
    ctaLink: "/category/Teams%20%3E%20Los%20Angeles%20Dodgers%20(MLB)",
    sport: "MLB",
    ringImage: "https://youbethechamp.com.au/wp-content/uploads/2026/01/IMG_7998.jpeg",
    accentColor: "#003DA5",
    glowColor: "rgba(0,61,165,0.25)",
  },
  {
    id: 2,
    tag: "Just Dropped · 2025",
    headline: "OKC",
    sub: "Thunder",
    label: "Championship Ring",
    description: "Oklahoma City's finest hour. Own the ring that crowned a new NBA dynasty.",
    cta: "Shop OKC Rings",
    ctaLink: "/category/Teams%20%3E%20Oklahoma%20City%20Thunder%20(NBA)",
    sport: "NBA",
    ringImage: "https://youbethechamp.com.au/wp-content/uploads/2026/01/IMG_8039.jpeg",
    accentColor: "#007AC1",
    glowColor: "rgba(0,122,193,0.25)",
  },
  {
    id: 3,
    tag: "Icon Collection",
    headline: "Michael",
    sub: "Jordan",
    label: "6× NBA Champion",
    description: "Six rings. One legend. The greatest player ever — now immortalised in gold.",
    cta: "Shop MJ Rings",
    ctaLink: "/category/All%20Time%20Greats%20%3E%20Michael%20Jordan%20(NBA)",
    sport: "NBA",
    ringImage: "https://youbethechamp.com.au/wp-content/uploads/2026/02/IMG_8542.jpeg",
    accentColor: "#CE1141",
    glowColor: "rgba(206,17,65,0.22)",
  },
  {
    id: 4,
    tag: "Dynasty Series",
    headline: "New England",
    sub: "Patriots",
    label: "6× Super Bowl Champions",
    description: "The greatest dynasty in NFL history. Six Lombardi Trophies. One legendary ring set.",
    cta: "Shop Patriots Rings",
    ctaLink: "/category/Teams%20%3E%20New%20England%20Patriots%20(NFL)",
    sport: "NFL",
    ringImage: "https://youbethechamp.com.au/wp-content/uploads/2026/01/IMG_8013.jpeg",
    accentColor: "#002244",
    glowColor: "rgba(0,34,68,0.3)",
  },
  {
    id: 5,
    tag: "The Vault",
    headline: "523",
    sub: "Championships",
    label: "One Collection",
    description: "Every ring. Every legend. Every sport. The world's largest championship ring catalog.",
    cta: "Shop All Rings",
    ctaLink: "/shop",
    sport: "ALL",
    ringImage: "https://youbethechamp.com.au/wp-content/uploads/2026/01/IMG_8059.jpeg",
    accentColor: "#C9A84C",
    glowColor: "rgba(201,168,76,0.2)",
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
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [products, setProducts] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const ringX = useTransform(mouseX, [0, window.innerWidth], [-18, 18]);
  const ringY = useTransform(mouseY, [0, window.innerHeight], [-12, 12]);
  const heroRef = useRef(null);

  const goTo = useCallback((idx) => {
    setDirection(idx > currentSlide ? 1 : -1);
    setCurrentSlide(idx);
  }, [currentSlide]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide(s => (s + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide(s => (s - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nextSlide, prevSlide]);

  const handleMouseMove = useCallback((e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }, [mouseX, mouseY]);

  useEffect(() => {
    api.get('/products?limit=9&isActive=true').then(res => {
      if (res.data.success) setProducts(res.data.data.slice(0, 9));
    }).catch(() => {});
    api.get('/blog?published=true&limit=3').then(res => {
      if (res.data.success) setBlogPosts(res.data.data);
    }).catch(() => {});
  }, []);

  const slide = SLIDES[currentSlide];

  const slideVariants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  const ringVariants = {
    enter: (dir) => ({ opacity: 0, scale: 0.82, rotate: dir > 0 ? 12 : -12, y: 30 }),
    center: { opacity: 1, scale: 1, rotate: 0, y: 0 },
    exit: (dir) => ({ opacity: 0, scale: 0.88, rotate: dir > 0 ? -8 : 8, y: -20 }),
  };

  return (
    <div className="bg-black min-h-screen text-ivory selection:bg-gold selection:text-black">
      <Header />

      {/* ── SECTION 1: HERO SLIDER ── */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative w-full bg-black overflow-hidden select-none"
        style={{ height: '100vh', minHeight: 700 }}
      >
        {/* Animated background glow that shifts per slide */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`bg-${slide.id}`}
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{ background: `radial-gradient(ellipse 60% 80% at 72% 50%, ${slide.glowColor} 0%, transparent 68%)` }}
          />
        </AnimatePresence>

        {/* Fine grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

        {/* Left edge accent */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none" style={{ background: `linear-gradient(to bottom, transparent, ${slide.accentColor}, transparent)` }} />

        {/* Bottom fade to black */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />

        {/* ── Slide content ── */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <div className="h-full grid grid-cols-1 lg:grid-cols-[1fr_1fr] max-w-[1400px] mx-auto px-8 lg:px-20 gap-0">

              {/* LEFT — text */}
              <div className="flex flex-col justify-center pt-28 pb-24 pr-0 lg:pr-16">

                {/* Sport badge + tag */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="flex items-center gap-3 mb-7"
                >
                  <span className="font-cinzel text-[9px] font-black uppercase tracking-[4px] px-3 py-1 border" style={{ borderColor: slide.accentColor, color: slide.accentColor }}>{slide.sport}</span>
                  <span className="w-6 h-px bg-gold/40" />
                  <span className="font-cinzel text-gold/70 text-[9px] uppercase tracking-[4px]">{slide.tag}</span>
                </motion.div>

                {/* Headline */}
                <div className="overflow-hidden mb-1">
                  <motion.h1
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="font-cinzel font-black uppercase text-white leading-[0.88] tracking-tight"
                    style={{ fontSize: 'clamp(3.5rem, 8vw, 8.5rem)' }}
                  >
                    {slide.headline}
                  </motion.h1>
                </div>
                <div className="overflow-hidden mb-5">
                  <motion.div
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="font-cinzel font-black uppercase leading-[0.88] tracking-tight gold-gradient-text"
                    style={{ fontSize: 'clamp(2.2rem, 5vw, 5.5rem)' }}
                  >
                    {slide.sub}
                  </motion.div>
                </div>

                {/* Ring label pill */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.28 }}
                  className="flex items-center gap-3 mb-7"
                >
                  <div className="h-px flex-1 max-w-[48px]" style={{ background: slide.accentColor }} />
                  <span className="font-cinzel text-white/50 text-[10px] uppercase tracking-[3px]">{slide.label}</span>
                </motion.div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.32 }}
                  className="text-white/45 font-raleway text-[15px] leading-relaxed mb-10 max-w-[380px]"
                >
                  {slide.description}
                </motion.p>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.38 }}
                  className="flex flex-wrap gap-4 mb-14"
                >
                  <Link to={slide.ctaLink}>
                    <span className="inline-flex items-center gap-3 bg-gold hover:bg-gold/90 text-black font-cinzel text-[11px] font-black uppercase tracking-[3px] px-9 py-4 transition-all group cursor-pointer">
                      {slide.cta}
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                  <Link to="/shop">
                    <span className="inline-flex items-center gap-2 border border-white/15 hover:border-gold/60 text-white/50 hover:text-gold font-cinzel text-[11px] uppercase tracking-[3px] px-9 py-4 transition-all cursor-pointer">
                      Browse All
                    </span>
                  </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.48 }}
                  className="flex gap-10 border-t border-white/[0.06] pt-8"
                >
                  {[['523', 'Rings Available'], ['4', 'Major Leagues'], ['120+', 'Years of History']].map(([n, l]) => (
                    <div key={l}>
                      <p className="font-cinzel font-black leading-none" style={{ fontSize: '1.5rem', color: slide.accentColor === '#C9A84C' ? '#C9A84C' : '#C9A84C' }}>{n}</p>
                      <p className="font-raleway text-[9px] text-white/25 uppercase tracking-[2px] mt-1.5">{l}</p>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* RIGHT — ring with mouse parallax */}
              <div className="hidden lg:flex items-center justify-center relative">
                {/* Outer decorative rings */}
                <motion.div
                  key={`circle-${slide.id}`}
                  className="absolute rounded-full border"
                  style={{ width: 560, height: 560, borderColor: `${slide.accentColor}20` }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  key={`circle2-${slide.id}`}
                  className="absolute rounded-full border"
                  style={{ width: 420, height: 420, borderColor: `${slide.accentColor}30` }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                />
                {/* Tick marks on outer ring */}
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-[2px] h-3"
                    style={{
                      background: `${slide.accentColor}40`,
                      top: '50%',
                      left: '50%',
                      transformOrigin: '50% 280px',
                      transform: `translateX(-50%) rotate(${i * 30}deg)`,
                    }}
                  />
                ))}

                {/* Glow core */}
                <div
                  className="absolute rounded-full pointer-events-none"
                  style={{ width: 340, height: 340, background: `radial-gradient(circle, ${slide.glowColor} 0%, transparent 70%)` }}
                />

                {/* Ring image with mouse parallax + float animation */}
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={`ring-${slide.id}`}
                    custom={direction}
                    variants={ringVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ x: ringX, y: ringY }}
                    className="relative z-10"
                  >
                    <motion.img
                      src={slide.ringImage}
                      alt={`${slide.headline} ${slide.sub} Championship Ring`}
                      animate={{ y: [0, -16, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-[380px] xl:w-[480px] object-contain select-none"
                      style={{
                        filter: `drop-shadow(0 30px 80px ${slide.glowColor}) drop-shadow(0 8px 24px rgba(0,0,0,0.9)) drop-shadow(0 0 40px rgba(201,168,76,0.3))`,
                        maxHeight: '70vh',
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Right edge: vertical slide counter ── */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden xl:flex flex-col items-center gap-4">
          <div className="flex flex-col gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="flex items-center justify-end gap-2 group"
              >
                <span className={`font-cinzel text-[9px] tracking-[2px] transition-all ${i === currentSlide ? 'text-gold' : 'text-white/20 group-hover:text-white/50'}`}>
                  0{i + 1}
                </span>
                <span className={`block transition-all duration-300 rounded-full ${
                  i === currentSlide ? 'w-6 h-[3px] bg-gold' : 'w-[3px] h-[3px] bg-white/20 group-hover:bg-white/50'
                }`} />
              </button>
            ))}
          </div>
        </div>

        {/* ── Bottom controls ── */}
        <div className="absolute bottom-10 left-8 lg:left-20 z-20 flex items-center gap-4">
          <button
            onClick={prevSlide}
            className="w-11 h-11 border border-white/10 hover:border-gold/60 flex items-center justify-center text-white/30 hover:text-gold transition-all duration-300 hover:bg-gold/5"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className="p-1">
                <span className={`block rounded-full transition-all duration-400 ${
                  i === currentSlide
                    ? 'w-8 h-[4px] bg-gold'
                    : 'w-[4px] h-[4px] bg-white/15 hover:bg-white/40'
                }`} />
              </button>
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="w-11 h-11 border border-white/10 hover:border-gold/60 flex items-center justify-center text-white/30 hover:text-gold transition-all duration-300 hover:bg-gold/5"
          >
            <ChevronRight size={16} />
          </button>
          <span className="font-cinzel text-[9px] text-white/15 tracking-[3px] ml-2">0{currentSlide + 1} — 0{SLIDES.length}</span>
        </div>

        {/* ── Progress bar ── */}
        <div className="absolute bottom-0 inset-x-0 h-[2px] bg-white/[0.04] z-20">
          <motion.div
            key={`${currentSlide}-${isPaused}`}
            className="h-full"
            style={{ background: slide.accentColor === '#C9A84C' ? '#C9A84C' : '#C9A84C' }}
            initial={{ width: '0%' }}
            animate={{ width: isPaused ? undefined : '100%' }}
            transition={{ duration: 6, ease: 'linear' }}
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
