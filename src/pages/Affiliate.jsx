import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useAuthStore } from '../store/useAuthStore';
import { Share2, DollarSign, Users, Award, ExternalLink, Copy, Check } from 'lucide-react';

const Affiliate = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [copied, setCopied] = React.useState(false);

  const affiliateLink = user ? `https://youbethechamp.com/?ref=${user.affiliateId || 'CHAMP10'}` : 'https://youbethechamp.com/?ref=CHAMP10';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { 
      icon: Users, 
      title: "Join The Network", 
      desc: "Create your account and get your unique curator code instantly." 
    },
    { 
      icon: Share2, 
      title: "Share The Glory", 
      desc: "Post your link on social media, sports forums, or your personal blog." 
    },
    { 
      icon: DollarSign, 
      title: "Earn 15% Commission", 
      desc: "Receive a high-tier payout for every successful championship sale." 
    }
  ];

  return (
    <div className="bg-black min-h-screen">
      <Header />
      
      <main className="pt-40 pb-24 px-8">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <span className="text-gold font-cinzel text-xs tracking-[6px] uppercase">Elite Curator Program</span>
            <h1 className="text-5xl md:text-7xl font-black font-cinzel text-white tracking-widest uppercase leading-tight">
              Earn While You <br/> <span className="gold-gradient-text">Celebrate Victory</span>
            </h1>
            <p className="text-ivory/60 font-raleway text-sm uppercase tracking-widest max-w-2xl mx-auto leading-loose">
              Join the official affiliation network of the world's largest championship replica vault. 
              Share your passion for sports history and earn industry-leading commissions.
            </p>
            
            <div className="pt-10">
              {isAuthenticated ? (
                <div className="bg-card border border-gold/20 p-8 max-w-xl mx-auto">
                   <p className="text-[10px] text-gold/60 font-cinzel tracking-[4px] uppercase mb-4 text-left">Your Unique Affiliate Link</p>
                   <div className="flex gap-4">
                      <div className="flex-1 bg-black border border-gold/10 px-4 py-3 font-mono text-[10px] text-ivory truncate flex items-center">
                         {affiliateLink}
                      </div>
                      <button 
                        onClick={copyToClipboard}
                        className="bg-gold text-black px-6 font-cinzel text-[10px] font-bold tracking-widest uppercase hover:bg-gold-light transition-all flex items-center gap-2"
                      >
                         {copied ? <Check size={14}/> : <Copy size={14}/>}
                         {copied ? 'Copied' : 'Copy'}
                      </button>
                   </div>
                </div>
              ) : (
                <Link to="/account/register">
                  <Button className="px-12 py-5">Apply For Curatorship</Button>
                </Link>
              )}
            </div>
          </motion.div>
        </section>

        {/* How it works */}
        <section className="max-w-7xl mx-auto mb-40">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {steps.map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card border border-gold/10 p-10 text-center hover:border-gold/30 transition-all group"
                >
                   <div className="w-16 h-16 bg-gold/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-gold/20 group-hover:bg-gold group-hover:text-black transition-all">
                      <step.icon size={24} />
                   </div>
                   <h3 className="font-cinzel text-white text-lg font-bold uppercase tracking-widest mb-4">{step.title}</h3>
                   <p className="text-ivory/40 text-[10px] uppercase tracking-widest leading-relaxed">
                      {step.desc}
                   </p>
                </motion.div>
              ))}
           </div>
        </section>

        {/* Benefits Table */}
        <section className="max-w-4xl mx-auto mb-40 bg-card border border-gold/20 overflow-hidden">
           <div className="p-10 border-b border-gold/10">
              <h2 className="font-cinzel text-gold text-2xl font-bold uppercase tracking-[4px]">Program Benefits</h2>
           </div>
           <div className="divide-y divide-gold/10">
              <BenefitRow label="Commission Rate" value="15% Per Sale" />
              <BenefitRow label="Cookie Duration" value="30 Days" />
              <BenefitRow label="Payout Threshold" value="$50.00 AUD" />
              <BenefitRow label="Support" value="Dedicated Account Manager" />
              <BenefitRow label="Marketing Assets" value="Banners, Email Templates, Product Feed" />
           </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto text-center py-24 bg-gold/5 border border-gold/10 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.1),transparent)]" />
           <div className="relative z-10">
              <Award className="text-gold mx-auto mb-6" size={48} />
              <h2 className="font-cinzel text-3xl font-black text-white uppercase tracking-widest mb-6">Ready to Build Your Legacy?</h2>
              {!isAuthenticated && (
                <Link to="/account/register">
                  <Button variant="outline">Create Your Affiliate Account</Button>
                </Link>
              )}
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const BenefitRow = ({ label, value }) => (
  <div className="flex justify-between items-center p-6 px-10 hover:bg-gold/5 transition-colors group">
     <span className="font-raleway text-[10px] text-ivory/40 uppercase tracking-[2px]">{label}</span>
     <span className="font-cinzel text-xs font-bold text-ivory group-hover:text-gold transition-colors uppercase tracking-widest">{value}</span>
  </div>
);

export default Affiliate;
