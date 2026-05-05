import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Share2, Video, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

const SocialIcon = ({ Icon }) => (
  <a href="#" className="w-10 h-10 border border-gold/20 flex items-center justify-center text-gold/50 hover:text-gold hover:border-gold transition-all">
    <Icon size={16} />
  </a>
);

const FooterLink = ({ to, children, bold }) => (
  <li>
    <Link
      to={to}
      className={`hover:text-gold transition-colors font-raleway text-xs uppercase tracking-widest ${bold ? 'text-white font-bold' : 'text-ivory/60'}`}
    >
      {children}
    </Link>
  </li>
);

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-gold/10 pt-24 pb-12 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

        {/* Col 1 — Brand */}
        <div className="space-y-8">
          <Link to="/" className="flex items-center group">
            <div className="relative w-32 h-32 transition-all duration-500 group-hover:scale-105">
              <img src="/logo.png" alt="You Be The Champ Logo" className="w-full h-full object-contain" />
            </div>
          </Link>
          <p className="text-ivory/40 font-raleway text-sm leading-relaxed uppercase tracking-wider">
            Handcrafting the largest collection of championship replica rings in the world. Wear the glory of your favorite legends.
          </p>
          <div className="flex gap-3">
            <SocialIcon Icon={Globe} />
            <SocialIcon Icon={Share2} />
            <SocialIcon Icon={Video} />
            <SocialIcon Icon={MessageCircle} />
          </div>
          <div className="space-y-3 text-xs font-raleway uppercase tracking-wider">
            <div className="flex items-center gap-3 text-ivory/50">
              <Mail size={13} className="text-gold flex-shrink-0" />
              <span>support@youbethechamp.com</span>
            </div>
            <div className="flex items-center gap-3 text-ivory/50">
              <Phone size={13} className="text-gold flex-shrink-0" />
              <span>+1 (555) CHAMP-01</span>
            </div>
            <div className="flex items-center gap-3 text-ivory/50">
              <MapPin size={13} className="text-gold flex-shrink-0" />
              <span>Los Angeles, CA</span>
            </div>
          </div>
        </div>

        {/* Col 2 — Shop */}
        <div>
          <h4 className="font-cinzel text-gold text-sm font-bold uppercase tracking-widest mb-8">Shop</h4>
          <ul className="space-y-4">
            <FooterLink to="/category/All%20Time%20Greats" bold>All Time Greats</FooterLink>
            <FooterLink to="/category/League%20%3E%20NFL%20-%20National%20Football%20League">NFL</FooterLink>
            <FooterLink to="/category/League%20%3E%20NBA%20-%20National%20Basketball%20Association">NBA</FooterLink>
            <FooterLink to="/category/League%20%3E%20MLB%20-%20Major%20League%20Baseball">MLB</FooterLink>
            <FooterLink to="/category/League%20%3E%20NHL%20-%20National%20Hockey%20League">NHL</FooterLink>
            <FooterLink to="/shop">Shop All</FooterLink>
          </ul>
        </div>

        {/* Col 3 — Support */}
        <div>
          <h4 className="font-cinzel text-gold text-sm font-bold uppercase tracking-widest mb-8">Support</h4>
          <ul className="space-y-4">
            <FooterLink to="/contact">Contact Us</FooterLink>
            <FooterLink to="/faq">FAQs</FooterLink>
            <FooterLink to="/size-guide">Sizing Guide</FooterLink>
            <FooterLink to="/shipping-policy">Shipping Policy</FooterLink>
            <FooterLink to="/return-policy">Returns & Refunds</FooterLink>
          </ul>
        </div>

        {/* Col 4 — Corporate */}
        <div>
          <h4 className="font-cinzel text-gold text-sm font-bold uppercase tracking-widest mb-8">Corporate</h4>
          <ul className="space-y-4">
            <FooterLink to="/affiliate" bold>Affiliates</FooterLink>
            <FooterLink to="/about">About Us</FooterLink>
            <FooterLink to="/faq">FAQs</FooterLink>
            <FooterLink to="/blog">News & Blog</FooterLink>
            <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
            <FooterLink to="/terms-of-service">Terms of Service</FooterLink>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-12 border-t border-gold/10 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-[10px] text-ivory/40 uppercase tracking-[2px]">
          © {new Date().getFullYear()} YOU BE THE CHAMP. NON-OFFICIALLY LICENSED FAN ART REPLICAS.
        </p>
        <div className="flex gap-8 text-[10px] text-ivory/40 uppercase tracking-[2px]">
          <Link to="/privacy-policy" className="hover:text-gold transition-colors">Privacy</Link>
          <Link to="/terms-of-service" className="hover:text-gold transition-colors">Terms</Link>
          <Link to="/authenticity" className="hover:text-gold transition-colors">Authenticity</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
