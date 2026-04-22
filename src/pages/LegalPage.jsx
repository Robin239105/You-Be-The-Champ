import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';

const LegalPage = ({ title }) => {
  return (
    <div className="bg-black min-h-screen">
      <Header />
      
      <main className="max-w-4xl mx-auto px-8 pt-40 pb-24">
        <Breadcrumb items={[{ name: title, path: '/legal' }]} />
        
        <h1 className="text-4xl font-black font-cinzel text-gold tracking-widest uppercase mb-12">{title}</h1>
        
        <div className="prose prose-invert max-w-none space-y-8 text-ivory/60 font-raleway leading-relaxed text-sm uppercase tracking-wider">
          <section className="space-y-4">
            <h2 className="text-xl font-cinzel text-ivory font-bold uppercase tracking-widest border-b border-gold/10 pb-4">Overview</h2>
            <p>Welcome to You Be The Champ. By accessing or using our website, you agree to be bound by the following terms, conditions, and policies. Our commitment is to provide high-quality replica championship rings with full transparency regarding their nature as non-officially licensed fan collectibles.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-cinzel text-ivory font-bold uppercase tracking-widest border-b border-gold/10 pb-4">Quality & Craftsmanship</h2>
            <p>All rings are manufactured with a zinc alloy base and undergo a proprietary quadruple 18K gold plating process. While we strive for extreme durability, these items are designed for display and occasional wear. Avoid contact with abrasive chemicals or excessive moisture to preserve the gold finish.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-cinzel text-ivory font-bold uppercase tracking-widest border-b border-gold/10 pb-4">Shipping & Returns</h2>
            <p>We ship worldwide from our central distribution hub. Orders over $150 qualify for free standard shipping. Due to the high value and collectible nature of our products, returns are accepted within 30 days only if the item is in its original, unworn condition with all protective seals intact.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-cinzel text-ivory font-bold uppercase tracking-widest border-b border-gold/10 pb-4">Legal Disclaimer</h2>
            <p>YOU BE THE CHAMP is not affiliated with, endorsed by, or sponsored by the NFL, NBA, MLB, NHL, or any specific professional sports team. Our products are artistic replicas intended for fan appreciation and historical commemoration only.</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalPage;
