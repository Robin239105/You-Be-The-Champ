import React from 'react';
import { Link } from 'react-router-dom';

// Facebook Icon SVG
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

// X (Twitter) Icon SVG
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
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
  <a href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-gray-500 flex items-center justify-center text-gray-400 hover:text-white hover:border-white hover:bg-gray-700 transition-all">
    {children}
  </a>
);

const FooterLink = ({ to, children, bold }) => (
  <li>
    <Link
      to={to}
      className={`hover:text-white transition-colors font-raleway text-[11px] md:text-xs uppercase tracking-widest leading-relaxed ${bold ? 'text-white font-bold' : 'text-gray-400'}`}
    >
      {children}
    </Link>
  </li>
);

const Footer = () => {
  return (
    <footer className="bg-[#222222] border-t border-gray-700 pt-12 md:pt-24 pb-8 md:pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Mobile Brand Section - Centered */}
        <div className="md:hidden mb-12 text-center">
          <Link to="/" className="flex items-center justify-center group mb-6">
            <div className="relative w-40 h-40 transition-all duration-500 group-hover:scale-105">
              <img src="/logo.png" alt="You Be The Champ Logo" className="w-full h-full object-contain" />
            </div>
          </Link>
          <p className="text-gray-400 font-raleway text-xs leading-relaxed uppercase tracking-wider mb-6 px-2">
            Now, you can relive the moment, celebrate the victories, and wear the glory of your favorite team and iconic legends. This time though, YOU BE THE CHAMP!
          </p>
          <div className="flex gap-3 justify-center">
            <SocialIcon href="https://facebook.com/youbethechamp">
              <FacebookIcon />
            </SocialIcon>
            <SocialIcon href="https://x.com/youbethechamp">
              <XIcon />
            </SocialIcon>
            <SocialIcon href="https://instagram.com/youbethechamp">
              <InstagramIcon />
            </SocialIcon>
            <SocialIcon href="https://t.me/youbethechamp">
              <TelegramIcon />
            </SocialIcon>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16 mb-12 md:mb-20">

          {/* Desktop Brand Section - Left */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <Link to="/" className="flex items-center group">
              <div className="relative w-40 h-40 transition-all duration-500 group-hover:scale-105">
                <img src="/logo.png" alt="You Be The Champ Logo" className="w-full h-full object-contain" />
              </div>
            </Link>
            <p className="text-gray-400 font-raleway text-xs leading-relaxed uppercase tracking-wider">
              Now, you can relive the moment, celebrate the victories, and wear the glory of your favorite team and iconic legends. This time though, YOU BE THE CHAMP!
            </p>
            <div className="flex gap-3">
              <SocialIcon href="https://facebook.com/youbethechamp">
                <FacebookIcon />
              </SocialIcon>
              <SocialIcon href="https://x.com/youbethechamp">
                <XIcon />
              </SocialIcon>
              <SocialIcon href="https://instagram.com/youbethechamp">
                <InstagramIcon />
              </SocialIcon>
              <SocialIcon href="https://t.me/youbethechamp">
                <TelegramIcon />
              </SocialIcon>
            </div>
          </div>

          {/* Col 1 — Shop */}
          <div className="lg:col-span-1">
            <h4 className="font-cinzel text-gray-200 text-sm md:text-base font-bold uppercase tracking-widest mb-6 md:mb-8">Shop</h4>
            <ul className="space-y-3 md:space-y-4">
              <FooterLink to="/category/All%20Time%20Greats">All Time Greats</FooterLink>
              <FooterLink to="/category/League%20%3E%20NFL%20-%20National%20Football%20League">NFL</FooterLink>
              <FooterLink to="/category/League%20%3E%20NBA%20-%20National%20Basketball%20Association">NBA</FooterLink>
              <FooterLink to="/category/League%20%3E%20MLB%20-%20Major%20League%20Baseball">MLB</FooterLink>
              <FooterLink to="/category/League%20%3E%20NHL%20-%20National%20Hockey%20League">NHL</FooterLink>
              <FooterLink to="/shop">Shop All</FooterLink>
            </ul>
          </div>

          {/* Col 2 — Support */}
          <div className="lg:col-span-1">
            <h4 className="font-cinzel text-gray-200 text-sm md:text-base font-bold uppercase tracking-widest mb-6 md:mb-8">Support</h4>
            <ul className="space-y-3 md:space-y-4">
              <FooterLink to="/contact">Contact Us</FooterLink>
              <FooterLink to="/faq">FAQs</FooterLink>
              <FooterLink to="/size-guide">Sizing Guide</FooterLink>
              <FooterLink to="/shipping-policy">Shipping Policy</FooterLink>
              <FooterLink to="/return-policy">Returns & Refunds</FooterLink>
            </ul>
          </div>

          {/* Col 3 — Legal (Hidden on mobile, shown on lg) */}
          <div className="hidden lg:block lg:col-span-1">
            <h4 className="font-cinzel text-gray-200 text-base font-bold uppercase tracking-widest mb-8">Legal</h4>
            <ul className="space-y-4">
              <FooterLink to="/affiliate" bold>Affiliates</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/blog">News & Blog</FooterLink>
              <FooterLink to="/authenticity">Authenticity</FooterLink>
              <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink to="/terms-of-service">Terms of Service</FooterLink>
            </ul>
          </div>
        </div>

        {/* Mobile Legal Links */}
        <div className="md:hidden grid grid-cols-2 gap-6 mb-12">
          <div>
            <h4 className="font-cinzel text-gray-200 text-xs font-bold uppercase tracking-widest mb-4">Legal</h4>
            <ul className="space-y-3">
              <FooterLink to="/privacy-policy">Privacy</FooterLink>
              <FooterLink to="/terms-of-service">Terms</FooterLink>
              <FooterLink to="/return-policy">Returns</FooterLink>
              <FooterLink to="/authenticity">Authenticity</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="max-w-7xl mx-auto pt-6 md:pt-12 border-t border-gray-700 flex justify-center items-center">
          <p className="text-xs md:text-sm text-gray-400 uppercase tracking-[1px] md:tracking-[2px] text-center leading-relaxed">
            © {new Date().getFullYear()} You Be The Champ
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
