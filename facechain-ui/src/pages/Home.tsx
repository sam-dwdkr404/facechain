import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-fc-emerald flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        {/* Additional sections could go here */}
        <section id="pipeline-details" className="w-full px-8 lg:px-16 py-24 border-t border-fc-emerald-light">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-4xl text-fc-cream mb-12">System Architecture</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'DETECT', desc: 'Identify facial structures using high-dimensional biometric encodings.' },
                { step: '02', title: 'SEARCH', desc: 'Perform decentralized reverse-image analysis across public intelligence networks.' },
                { step: '03', title: 'ANCHOR', desc: 'Cryptographically commit the verification proof to the Polygon blockchain.' }
              ].map((item) => (
                <div key={item.step} className="border border-fc-emerald-light p-8 hover:border-fc-pink transition-colors">
                  <span className="font-mono text-fc-pink text-xs mb-4 block">{item.step} // STAGE</span>
                  <h3 className="font-sans text-2xl text-fc-yellow mb-4 font-bold">{item.title}</h3>
                  <p className="font-mono text-fc-cream opacity-70 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
