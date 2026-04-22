import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import SectionDivider from '../components/SectionDivider';

const SizeGuide = () => {
  const sizes = [
    { us: '7', mm: '17.3', circ: '54.4' },
    { us: '8', mm: '18.1', circ: '57.0' },
    { us: '9', mm: '19.0', circ: '59.5' },
    { us: '10', mm: '19.8', circ: '62.1' },
    { us: '11', mm: '20.6', circ: '64.6' },
    { us: '12', mm: '21.4', circ: '67.2' },
    { us: '13', mm: '22.2', circ: '69.7' },
    { us: '14', mm: '23.0', circ: '72.3' },
  ];

  return (
    <div className="bg-black min-h-screen">
      <Header />
      
      <main className="max-w-4xl mx-auto px-8 pt-40 pb-24">
        <Breadcrumb items={[{ name: 'Size Guide', path: '/size-guide' }]} />
        
        <h1 className="text-4xl md:text-5xl font-black font-cinzel text-gold tracking-widest uppercase mb-12">Championship Sizing</h1>
        
        <div className="space-y-16">
          <section className="bg-card border border-gold/10 p-10">
            <h2 className="text-xl font-cinzel text-ivory font-bold uppercase tracking-widest mb-6 border-b border-gold/10 pb-4">Ring Size Chart</h2>
            <div className="overflow-x-auto">
               <table className="w-full text-left font-mono text-sm">
                  <thead>
                     <tr className="border-b border-gold/20 text-gold/60 uppercase text-[10px] tracking-widest">
                        <th className="py-4">US Size</th>
                        <th className="py-4">Diameter (mm)</th>
                        <th className="py-4">Circumference (mm)</th>
                     </tr>
                  </thead>
                  <tbody className="text-ivory/60">
                     {sizes.map((s, i) => (
                        <tr key={i} className="border-b border-gold/5 hover:bg-gold/5 transition-colors">
                           <td className="py-4 font-bold text-gold">{s.us}</td>
                           <td className="py-4">{s.mm}mm</td>
                           <td className="py-4">{s.circ}mm</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="bg-surface border border-gold/10 p-8 space-y-4">
                <h3 className="font-cinzel text-sm font-bold text-gold uppercase tracking-widest">How to Measure</h3>
                <p className="text-[11px] text-ivory/60 leading-loose uppercase tracking-widest">
                  1. Wrap a piece of string around the base of your intended finger.<br/>
                  2. Mark the point where the string ends meet.<br/>
                  3. Measure the string in millimeters and compare to our chart.
                </p>
             </div>
             <div className="bg-surface border border-gold/10 p-8 space-y-4">
                <h3 className="font-cinzel text-sm font-bold text-gold uppercase tracking-widest">Pro Tip</h3>
                <p className="text-[11px] text-ivory/60 leading-loose uppercase tracking-widest italic">
                  "Championship rings have a massive band width. If you are between sizes, we strongly recommend choosing the larger size for a comfortable legacy fit."
                </p>
             </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SizeGuide;
