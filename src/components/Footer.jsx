import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Share2, Video, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-gold/10 pt-24 pb-12 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
        {/* Brand Column */}
        <div className="space-y-8">
          <Link to="/" className="flex items-center group">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gold/30 shadow-[0_0_20px_rgba(201,168,76,0.2)] group-hover:border-gold transition-all duration-500">
              <img 
                src="/src/assets/Unknown.jpg" 
                alt="You Be The Champ Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
          <p className="text-ivory/40 font-raleway text-sm leading-relaxed uppercase tracking-wider">
            Handcrafting the largest collection of championship replica rings in the world. Wear the glory of your favorite legends.
          </p>
          <div className="flex gap-4">
            <SocialIcon Icon={Globe} />
            <SocialIcon Icon={Share2} />
            <SocialIcon Icon={Video} />
            <SocialIcon Icon={MessageCircle} />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-cinzel text-gold text-sm font-bold uppercase tracking-widest mb-8">Navigation</h4>
          <ul className="space-y-4 font-raleway text-xs uppercase tracking-widest text-ivory/60">
            <li><Link to="/shop" className="hover:text-gold transition-colors">All Collections</Link></li>
            <li><Link to="/player-editions" className="hover:text-gold transition-colors">Player Editions</Link></li>
            <li><Link to="/vintage-90s" className="hover:text-gold transition-colors">Vintage 90s</Link></li>
            <li><Link to="/affiliate" className="hover:text-gold transition-colors">Curator Program</Link></li>
            <li><Link to="/blog" className="hover:text-gold transition-colors">The Locker Room</Link></li>
            <li><Link to="/about" className="hover:text-gold transition-colors">Our Legacy</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-cinzel text-gold text-sm font-bold uppercase tracking-widest mb-8">Support</h4>
          <ul className="space-y-4 font-raleway text-xs uppercase tracking-widest text-ivory/60">
            <li><Link to="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
            <li><Link to="/faq" className="hover:text-gold transition-colors">Knowledge Vault</Link></li>
            <li><Link to="/size-guide" className="hover:text-gold transition-colors">Sizing Guide</Link></li>
            <li><Link to="/shipping-policy" className="hover:text-gold transition-colors">Shipping Policy</Link></li>
            <li><Link to="/return-policy" className="hover:text-gold transition-colors">Returns & Refunds</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-cinzel text-gold text-sm font-bold uppercase tracking-widest mb-8">Direct Line</h4>
          <ul className="space-y-6">
            <li className="flex gap-4 items-start">
               <Mail size={16} className="text-gold mt-1" />
               <div className="text-xs uppercase tracking-widest font-raleway">
                  <p className="text-ivory/40 mb-1">Email</p>
                  <p className="text-white">support@youbethechamp.com</p>
               </div>
            </li>
            <li className="flex gap-4 items-start">
               <Phone size={16} className="text-gold mt-1" />
               <div className="text-xs uppercase tracking-widest font-raleway">
                  <p className="text-ivory/40 mb-1">Phone</p>
                  <p className="text-white">+1 (555) CHAMP-01</p>
               </div>
            </li>
            <li className="flex gap-4 items-start">
               <MapPin size={16} className="text-gold mt-1" />
               <div className="text-xs uppercase tracking-widest font-raleway">
                  <p className="text-ivory/40 mb-1">Location</p>
                  <p className="text-white">Los Angeles, CA</p>
               </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-12 border-t border-gold/10 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-[10px] text-ivory/40 uppercase tracking-[2px]">
          © 2024 YOU BE THE CHAMP. NON-OFFICIALLY LICENSED FAN ART REPLICAS.
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

const SocialIcon = ({ Icon }) => (
  <a href="#" className="w-10 h-10 border border-gold/10 flex items-center justify-center text-ivory/40 hover:text-gold hover:border-gold transition-all">
    <Icon size={18} />
  </a>
);

export default Footer;
