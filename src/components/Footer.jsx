import React from 'react';
import { Link } from 'react-router-dom';

// Facebook Icon SVG
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

// Instagram Icon SVG
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

// Telegram Icon SVG
const TelegramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const SocialIcon = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-gray-600 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-900 hover:bg-gray-200 transition-all">
    {children}
  </a>
);

const FooterLink = ({ to, children, bold }) => (
  <li>
    <Link
      to={to}
      className={`hover:text-gray-900 transition-colors font-raleway text-xs uppercase tracking-widest ${bold ? 'text-gray-900 font-bold' : 'text-gray-600'}`}
    >
      {children}
    </Link>
  </li>
);

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-300 pt-24 pb-12 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

        {/* Col 1 — Brand */}
        <div className="space-y-8">
          <Link to="/" className="flex items-center group">
            <div className="relative w-32 h-32 transition-all duration-500 group-hover:scale-105">
              <img src="/logo.png" alt="You Be The Champ Logo" className="w-full h-full object-contain" />
            </div>
          </Link>
          <p className="text-gray-600 font-raleway text-sm leading-relaxed uppercase tracking-wider">
            Handcrafting the largest collection of championship replica rings in the world. Wear the glory of your favorite legends.
          </p>
          <div className="flex gap-3">
            <SocialIcon href="https://facebook.com/youbethechamp">
              <FacebookIcon />
            </SocialIcon>
            <SocialIcon href="https://instagram.com/youbethechamp">
              <InstagramIcon />
            </SocialIcon>
            <SocialIcon href="https://t.me/youbethechamp">
              <TelegramIcon />
            </SocialIcon>
          </div>
        </div>

        {/* Col 2 — Shop */}
        <div>
          <h4 className="font-cinzel text-gray-900 text-sm font-bold uppercase tracking-widest mb-8">Shop</h4>
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
          <h4 className="font-cinzel text-gray-900 text-sm font-bold uppercase tracking-widest mb-8">Support</h4>
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
          <h4 className="font-cinzel text-gray-900 text-sm font-bold uppercase tracking-widest mb-8">Corporate</h4>
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

      <div className="max-w-7xl mx-auto pt-12 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-[10px] text-gray-500 uppercase tracking-[2px]">
          © {new Date().getFullYear()} YOU BE THE CHAMP. NON-OFFICIALLY LICENSED FAN ART REPLICAS.
        </p>
        <div className="flex gap-8 text-[10px] text-gray-500 uppercase tracking-[2px]">
          <Link to="/privacy-policy" className="hover:text-gray-900 transition-colors">Privacy</Link>
          <Link to="/terms-of-service" className="hover:text-gray-900 transition-colors">Terms</Link>
          <Link to="/authenticity" className="hover:text-gray-900 transition-colors">Authenticity</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
