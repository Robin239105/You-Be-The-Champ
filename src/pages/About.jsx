import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import SectionDivider from '../components/SectionDivider';
import Button from '../components/Button';
import { Shield, Award, Users, Gem } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-black min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-8 pt-40 pb-24">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <Breadcrumb items={[{ name: 'About Us', path: '/about' }]} />
          <h1 className="text-4xl md:text-6xl font-black font-cinzel text-gold tracking-widest uppercase mb-8">Our Legacy</h1>
          <p className="text-xl italic font-raleway text-ivory/80 leading-relaxed uppercase tracking-wider">
            "Built by Champions, For Champions. We believe every fan deserves to hold the weight of victory in their hands."
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
           <div className="bg-surface border border-gold/10 p-1 lg:p-2">
              <div className="aspect-[4/5] bg-black border border-gold/20 flex items-center justify-center p-12 overflow-hidden relative group">
                 <div className="absolute inset-0 gold-glow opacity-30" />
                 <svg className="w-64 h-64 text-gold/10 transform -rotate-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l2.4 7.4h7.6l-6.1 4.5 2.3 7.1-6.2-4.4-6.2 4.4 2.3-7.1-6.1-4.5h7.6z" />
                 </svg>
                 <div className="absolute bottom-10 left-10 p-6 bg-black/60 border border-gold/20 backdrop-blur-md">
                    <p className="font-cinzel text-gold text-lg">EST. 1994</p>
                    <p className="text-[10px] text-ivory/60 uppercase">The Original Vault</p>
                 </div>
              </div>
           </div>
           
           <div className="space-y-8">
              <h2 className="text-2xl font-black font-cinzel text-gold uppercase tracking-widest">The Championship Standard</h2>
              <p className="text-ivory/60 font-raleway leading-loose uppercase text-sm tracking-wide">
                Started in a small garage in 1994, You Be The Champ was founded on a simple realization: the rings presented to players represent more than just a season—they represent a lifetime of dedication. 
              </p>
              <p className="text-ivory/60 font-raleway leading-loose uppercase text-sm tracking-wide">
                We spent years perfecting the metallurgical process and stone-setting techniques required to produce replicas that are indistinguishable in weight and radiance from the original trophy pieces.
              </p>
              <div className="pt-4 grid grid-cols-2 gap-8">
                 <div>
                    <p className="text-3xl font-black font-cinzel text-gold">200+</p>
                    <p className="text-[10px] text-ivory/40 uppercase mt-1">Unique designs</p>
                 </div>
                 <div>
                    <p className="text-3xl font-black font-cinzel text-gold">50K+</p>
                    <p className="text-[10px] text-ivory/40 uppercase mt-1">Fans worldwide</p>
                 </div>
              </div>
           </div>
        </div>

        <SectionDivider />

        <section className="py-24">
           <h2 className="text-3xl font-black font-cinzel text-center text-gold uppercase tracking-[4px] mb-20">Our Values</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <ValueCard icon={Shield} title="Authenticity" desc="Every ring is weighted and engraved to match player-grade specs." />
              <ValueCard icon={Award} title="Quality" desc="Quadruple 18K gold plating ensures a lifetime of radiance." />
              <ValueCard icon={Gem} title="Legacy" desc="We preserve the history of every season, game, and dynasty." />
              <ValueCard icon={Users} title="Community" desc="The Champions Club is home to the world's most dedicated fans." />
           </div>
        </section>

        <section className="mt-24 p-16 bg-card border border-gold/10 text-center space-y-8">
            <h2 className="text-3xl font-black font-cinzel text-white uppercase tracking-widest">Ready To Own Your Victory?</h2>
            <a href="/shop"><Button variant="primary">Shop the Collection</Button></a>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const ValueCard = ({ icon: Icon, title, desc }) => (
  <div className="text-center group">
     <div className="w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-gold/5 transition-all">
        <Icon className="text-gold" size={28} />
     </div>
     <h3 className="font-cinzel text-sm font-bold text-ivory uppercase tracking-widest mb-3 group-hover:text-gold transition-colors">{title}</h3>
     <p className="text-[10px] text-ivory/40 leading-relaxed uppercase tracking-wider">{desc}</p>
  </div>
);

export default About;
