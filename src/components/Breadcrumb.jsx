import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-[10px] font-cinzel tracking-widest uppercase mb-12 py-4 border-b border-gold/10">
      <Link to="/" className="text-ivory/40 hover:text-gold transition-colors">Home</Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={10} className="text-gold/30" />
          <Link 
            to={item.path} 
            className={index === items.length - 1 ? 'text-gold font-bold' : 'text-ivory/40 hover:text-gold transition-colors'}
          >
            {item.name}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
