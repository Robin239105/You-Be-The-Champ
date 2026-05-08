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
import { optimizeImage } from '../utils/imageOptimizer';
import { productsData } from '../data/productsData';

const GOLD = '#C9A84C';
const GOLD_GLOW = 'rgba(201,168,76,0.22)';

// Official League Logos (PNG Images)
const NFLLogo = () => (
  <img src="/NFL Logo.png" alt="NFL" className="w-14 h-14 object-contain" />
);

const NBALogo = () => (
  <img src="/NBA Logo.png" alt="NBA" className="w-14 h-14 object-contain" />
);

const MLBLogo = () => (
  <img src="/MLB Logo.png" alt="MLB" className="w-14 h-14 object-contain" />
);

const NHLLogo = () => (
  <img src="/NHL Logo.png" alt="NHL" className="w-14 h-14 object-contain" />
);

const SLIDES = [
  {
    id: 1,
    tag: "MLB · New Arrival 2026",
    headline: "LOS ANGELES",
    sub: "DODGERS",
    label: "World Series Ring",
    description: "A true precision crafted masterpiece. Introducing the brand new 2025 LA Dodgers World Series Championship Ring",
    cta: "Secure Yours",
    ctaLink: "/category/Champions%20By%20Year%20%3E%202025",
    cta2: "Browse All Dodgers Rings",
    cta2Link: "/category/Teams%20%3E%20Los%20Angeles%20Dodgers%20(MLB)",
    sport: "MLB",
    ringImage: "/Slider 1.jpg",
    accentColor: GOLD,
    glowColor: GOLD_GLOW,
  },
  {
    id: 2,
    tag: "NFL · Hail the New Champions",
    headline: "SEATTLE",
    sub: "SEAHAWKS",
    label: "Superbowl Champions",
    description: "From domination to Champions - Seattle Seahawks are Superbowl Champions Again..",
    cta: "Pre Release Purchase",
    ctaLink: "/category/Champions%20By%20Year%20%3E%202014",
    cta2: "Buy Concept Ring",
    cta2Link: "/category/Teams%20%3E%20Seattle%20Seahawks%20(NFL)",
    sport: "NFL",
    ringImage: "/Slider 2.jpg",
    accentColor: GOLD,
    glowColor: GOLD_GLOW,
  },
  {
    id: 3,
    tag: "NBA · Just Dropped 2026",
    headline: "OKC",
    sub: "THUNDER",
    label: "NBA Finals Champions",
    description: "Bring it home to Oklahoma City Shai Gilgeous-Alexander: The NBA 2025 reigning MVP, Finals MVP, and CHAMPION.!",
    cta: "Grab Yours",
    ctaLink: "/category/Champions%20By%20Year%20%3E%202025",
    cta2: "Browse All NBA Rings",
    cta2Link: "/category/Teams%20%3E%20Oklahoma%20City%20Thunder%20(NBA)",
    sport: "NBA",
    ringImage: "/Slider 3_New.jpg",
    accentColor: GOLD,
    glowColor: GOLD_GLOW,
  },
  {
    id: 4,
    tag: "NHL · Back 2 Back",
    headline: "FLORIDA",
    sub: "PANTHERS",
    label: "Stanley Cup Triumph",
    description: "On the Ice back to back champions in the Florida Heat; the start of a dynasty.",
    cta: "Secure yours now",
    ctaLink: "/category/Champions%20By%20Year%20%3E%202025",
    cta2: "Buy the Back to Back Rings",
    cta2Link: "/category/Teams%20%3E%20Florida%20Panthers%20(NHL)",
    sport: "NHL",
    ringImage: "/Slider 4.jpg",
    accentColor: GOLD,
    glowColor: GOLD_GLOW,
  },
  {
    id: 5,
    tag: "NBA · Icon Collection",
    headline: "MICHAEL",
    sub: "JORDAN",
    label: "6 Time NBA Finals Champion",
    description: "The Undisputed GOAT; 6 x NBA Finals Champion, Two 3peats, 6 NBA Finals MVP. 5 x NBA MVP, 5 x NBA Scoring Titles, 2 x Defensive Player of the Year…….. Drop the Mic Mike.",
    cta: "The Michael Jordan Collection",
    ctaLink: "/category/All%20Time%20Greats%20%3E%20Michael%20Jordan%20(NBA)",
    cta2: "Other Iconic Legends Collections",
    cta2Link: "/category/All%20Time%20Greats%20%3E%20Michael%20Jordan%20(NBA)",
    sport: "NBA",
    ringImage: "/Slider 5.jpg",
    accentColor: GOLD,
    glowColor: GOLD_GLOW,
  },
  {
    id: 6,
    tag: "YOU - NFL, NBA, MLB, NHL",
    headline: "OWN THE",
    sub: "MOMENT",
    label: "Get your championship ring",
    description: "Every Ring., Every Legend. Every Sport. With a huge Championship Ring catalogue, now, you can relive the moment, but this time YOU BE THE CHAMP!",
    cta: "Shop All Rings",
    ctaLink: "/shop",
    cta2: "Browse Categories",
    cta2Link: "/category/Complete%20Team%20Sets%20-%20All%20Teams%20-%20NFL",
    sport: "ALL",
    ringImage: "/Slider 6.jpg",
    accentColor: GOLD,
    glowColor: GOLD_GLOW,
  },
  {
    id: 7,
    tag: "ALL - Championship Gift",
    headline: "MY YEAR,",
    sub: "MY GIFT BOX",
    label: "Premium gift ideas",
    description: "Available now; Complete sets of all 4 Championship Rings from the 4 leagues from each year. The perfect gift for any sports lover; the 4 years from their year of birth.",
    cta: "Select Year",
    ctaLink: "/your-year-gift",
    cta2: "Check out more rings",
    cta2Link: "/shop",
    sport: "ALL",
    ringImage: "/Slider 7.jpg",
    accentColor: GOLD,
    glowColor: GOLD_GLOW,
  },
];

const LEAGUES = [
  { name: "NFL", icon: NFLLogo, label: "National Football League", path: "League > NFL - National Football League", color: "#013369" },
  { name: "NBA", icon: NBALogo, label: "National Basketball Association", path: "League > NBA - National Basketball Association", color: "#C9002B" },
  { name: "MLB", icon: MLBLogo, label: "Major League Baseball", path: "League > MLB - Major League Baseball", color: "#002D72" },
  { name: "NHL", icon: NHLLogo, label: "National Hockey League", path: "League > NHL - National Hockey League", color: "#111111" },
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

  // Pre-load next slide's image
  useEffect(() => {
    const nextIdx = (currentSlide + 1) % SLIDES.length;
    const img = new Image();
    const nextImage = SLIDES[nextIdx].ringImage;
    img.src = nextImage.startsWith('http') ? optimizeImage(nextImage, { w: 1200, q: 85, fit: 'contain' }) : nextImage;
  }, [currentSlide]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nextSlide, prevSlide]);



  useEffect(() => {
    // Randomize 6 items from the 523 products on every page load
    if (productsData && productsData.length > 0) {
      const shuffled = [...productsData].sort(() => 0.5 - Math.random());
      setProducts(shuffled.slice(0, 6));
    }

    // Fetch blog posts separately
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


  return (
    <div className="bg-black min-h-screen text-ivory selection:bg-gold selection:text-black">
      <Header />

      {/* ── SECTION 1: HERO SLIDER ── */}
      <section
        ref={heroRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative w-full bg-black overflow-hidden select-none min-h-[600px] sm:min-h-[700px] lg:min-h-[720px] h-[90vh] lg:h-screen"
      >
        {/* ── Full-bleed ring background (right half) ── */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`ringbg-${slide.id}`}
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Gold radial glow behind ring */}
            <div className="absolute right-0 top-24 bottom-0 w-full lg:w-[55%] opacity-40 lg:opacity-100"
              style={{ background: `radial-gradient(ellipse 80% 80% at 70% 55%, ${slide.glowColor} 0%, transparent 75%)` }} />
            {/* Ring image — centered right on desktop; background-style on mobile */}
            <div
              className="absolute right-0 lg:right-[2%] top-20 bottom-0 w-full lg:w-[50%] flex items-center justify-center py-8 opacity-25 lg:opacity-100"
            >
               <img
                 src={slide.ringImage.startsWith('http') ? optimizeImage(slide.ringImage, { w: 1200, q: 85, fit: 'contain' }) : slide.ringImage}
                 alt={`${slide.headline} ${slide.sub} Championship Ring`}
                 className="w-full h-auto object-contain max-w-full"
                 style={{
                   maxHeight: 'calc(100vh - 160px)',
                   filter: `drop-shadow(0 30px 80px ${slide.glowColor}) drop-shadow(0 0 50px rgba(201,168,76,0.3)) drop-shadow(0 6px 25px rgba(0,0,0,0.8))`,
                 }}
                 fetchpriority={currentSlide === 0 ? "high" : "auto"}
                 loading={currentSlide === 0 ? "eager" : "lazy"}
                 decoding="async"
               />
            </div>
{/* Gradient mask — smoother blend from black to image area */}
             <div className="absolute inset-0 hidden lg:block" style={{ background: 'linear-gradient(to right, black 40%, rgba(0,0,0,0.95) 50%, rgba(0,0,0,0.8) 60%, transparent 70%)' }} />
             <div className="absolute inset-0 lg:hidden" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.9) 100%)' }} />
          </motion.div>
        </AnimatePresence>

        {/* Fine grid — left panel only */}
        <div className="absolute left-0 top-0 bottom-0 w-[48%] pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Gold left border */}
        <div className="absolute left-0 top-0 bottom-[72px] w-[3px] pointer-events-none bg-gold/30" />

        {/* ── Left text panel — sits in own layer, no overlap ── */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`text-${slide.id}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-0 bottom-[72px] w-full lg:w-[50%] flex flex-col justify-center px-5 sm:px-8 lg:px-16 xl:px-20"
            style={{ paddingTop: '120px' }}
          >
            {/* Tag row */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="flex items-center gap-3 mb-8"
            >
              <span className="font-cinzel text-[18px] font-black uppercase tracking-[10px] px-6 py-3 border border-gold/70 text-gold bg-gold/8">
                 {slide.sport}
               </span>
               <div className="flex items-center gap-4">
                 <span className="w-10 h-px bg-gold/40" />
                 <span className="font-cinzel text-white/40 text-[18px] uppercase tracking-[8px]">{slide.tag}</span>
               </div>
            </motion.div>

            {/* Headline block */}
            <div className="mb-5">
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: 90 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="font-cinzel font-black uppercase text-white"
                  style={{ fontSize: 'clamp(2.2rem, 5.5vw, 6.5rem)', lineHeight: 1.0, letterSpacing: '-0.02em' }}
                >
                  {slide.headline}
                </motion.h1>
              </div>
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: 90 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
                  className="font-cinzel font-black uppercase gold-gradient-text"
                  style={{ fontSize: 'clamp(2.2rem, 5.5vw, 6.5rem)', lineHeight: 1.0, letterSpacing: '-0.02em' }}
                >
                  {slide.sub}
                </motion.div>
              </div>
            </div>

            {/* Ring label — clear separator row */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.4, delay: 0.28, ease: 'easeOut' }}
              className="flex items-center gap-4 mb-6 origin-left"
            >
              <div className="h-[2px] w-12 bg-gold" />
              <span className="font-cinzel text-white/70 text-[10px] uppercase tracking-[4px] font-bold">{slide.label}</span>
              <div className="h-[2px] flex-1 max-w-[80px] bg-gold/15" />
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.32 }}
              className="text-white/60 font-raleway text-sm sm:text-base leading-[1.7] sm:leading-[1.8] mb-8 sm:mb-10 max-w-[420px]"
            >
              {slide.description}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.38 }}
              className="flex flex-wrap gap-3 sm:gap-4"
            >
              <Link to={slide.ctaLink}>
                <span className="inline-flex items-center gap-3 bg-gold hover:bg-gold/90 text-black font-cinzel text-[10px] sm:text-[11px] font-black uppercase tracking-[2px] sm:tracking-[3px] px-5 sm:px-8 py-3 sm:py-4 transition-all group cursor-pointer shadow-[0_0_30px_rgba(201,168,76,0.3)]">
                  {slide.cta}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              {slide.cta2 && (
                <Link to={slide.cta2Link}>
                  <span className="inline-flex items-center gap-2 border border-white/25 hover:border-gold text-white/50 hover:text-gold font-cinzel text-[10px] sm:text-[11px] uppercase tracking-[2px] sm:tracking-[3px] px-5 sm:px-8 py-3 sm:py-4 transition-all cursor-pointer">
                    {slide.cta2}
                  </span>
                </Link>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom bar — stats + controls, always separate ── */}
        <div className="absolute bottom-0 inset-x-0 h-[72px] z-20 border-t border-gold/15"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.96) 50%, rgba(0,0,0,0.5) 100%)' }}
        >
          <div className="h-full flex items-center px-5 sm:px-8 lg:px-16 xl:px-20 gap-0">

            {/* Stats removed as requested */}
            <div className="flex items-center gap-8 mr-auto">
            </div>

            {/* Slide controls */}
            <div className="flex items-center gap-3">
              <button onClick={prevSlide} className="w-8 h-8 border border-white/10 hover:border-gold/50 flex items-center justify-center text-white/30 hover:text-gold transition-all">
                <ChevronLeft size={14} />
              </button>
              <div className="flex items-center gap-1.5">
                {SLIDES.map((_, i) => (
                  <button key={i} onClick={() => goTo(i)}>
                    <span className={`block transition-all duration-300 ${
                      i === currentSlide ? 'w-6 h-[3px] bg-gold' : 'w-[3px] h-[3px] rounded-full bg-white/80 hover:bg-white'
                    }`} />
                  </button>
                ))}
              </div>
              <button onClick={nextSlide} className="w-8 h-8 border border-white/10 hover:border-gold/50 flex items-center justify-center text-white/30 hover:text-gold transition-all">
                <ChevronRight size={14} />
              </button>
              <span className="font-cinzel text-[9px] text-white/20 tracking-[3px] ml-1 hidden sm:block">0{currentSlide + 1}/0{SLIDES.length}</span>
            </div>
          </div>

          {/* Progress bar sits at very bottom of bar */}
          <div className="absolute bottom-0 inset-x-0 h-[2px] bg-white/[0.04]">
            <motion.div
              key={`${currentSlide}-${isPaused}`}
              className="h-full bg-gold"
              initial={{ width: '0%' }}
              animate={{ width: isPaused ? undefined : '100%' }}
              transition={{ duration: 6, ease: 'linear' }}
            />
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <Marquee />

      {/* ── SECTION 2: SHOP BY LEAGUE ── */}
      <section className="py-16 sm:py-24 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-gold font-cinzel text-[10px] tracking-[4px] uppercase block mb-3">Browse by Sport</span>
          <h2 className="text-2xl sm:text-4xl font-black font-cinzel tracking-widest text-white uppercase">Shop by League</h2>
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
              <div className="transition-transform duration-300 group-hover:scale-110 relative z-10">{React.createElement(league.icon)}</div>
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
      <section className="py-16 sm:py-24 px-5 sm:px-8 bg-white/[0.01] border-y border-gold/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-gold font-cinzel text-[10px] tracking-[4px] uppercase block mb-3">Most Popular</span>
            <h2 className="text-2xl sm:text-4xl font-black font-cinzel tracking-widest text-white uppercase">Championship Collection</h2>
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
      <section className="py-16 sm:py-24 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-gold font-cinzel text-[10px] tracking-[4px] uppercase block mb-3">Latest Updates</span>
          <h2 className="text-2xl sm:text-4xl font-black font-cinzel tracking-widest text-white uppercase">Locker Room Latest</h2>
          <div className="w-20 h-[2px] bg-gold mx-auto mt-5" />
        </div>
        {blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`}
                className="group flex flex-col border border-gold/10 hover:border-gold/40 bg-white/[0.02] hover:bg-gold/5 transition-all duration-300 overflow-hidden">
                {post.featuredImage ? (
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={optimizeImage(post.featuredImage, { w: 600, h: 340 })} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
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
      <section className="border-t border-white/5 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
          {VALUE_PROPS.map(({ icon, title, desc }) => {
            const IconComponent = icon;
            return (
              <div key={title} className="flex flex-col items-center text-center gap-6 group">
                <div className="w-16 h-16 border border-gold/30 flex items-center justify-center bg-black/40 group-hover:border-gold group-hover:bg-black/60 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                  <IconComponent size={26} className="text-gold" />
                </div>
                <div className="max-w-[240px]">
                  <h4 className="font-cinzel text-white font-black text-sm uppercase tracking-[3px] mb-3 group-hover:text-gold transition-colors">{title}</h4>
                  <p className="text-ivory/70 font-raleway text-[13px] leading-relaxed font-medium">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
