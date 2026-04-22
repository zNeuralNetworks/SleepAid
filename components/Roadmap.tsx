import React from 'react';
import { Palette, Move, Smartphone, Type, Zap, CheckCircle2, Circle, Music, Activity, AlarmClock, Sliders, Layers, LifeBuoy } from 'lucide-react';
import { motion } from 'framer-motion';

const Roadmap: React.FC = () => {
  const milestones = [
    {
      status: 'live',
      title: 'Tactile Haptics',
      description: 'Integrated subtle vibration patterns into the Breathing Tool. Allows users to follow the 4-7-8 rhythm with their eyes completely closed (Android/Supported devices).',
      icon: Smartphone,
      quarter: 'Q4 2024'
    },
    {
      status: 'live',
      title: 'Fluid Motion Design',
      description: 'Implemented shared element transitions and spring-physics animations. The goal is a seamless, liquid-like flow that feels calming rather than abrupt.',
      icon: Move,
      quarter: 'Q3 2024'
    },
    {
      status: 'live',
      title: 'NSDR Protocols',
      description: 'A dedicated library of Non-Sleep Deep Rest (Yoga Nidra) sessions. Now available to replenish dopamine and accelerate learning neuroplasticity.',
      icon: Activity,
      quarter: 'Q4 2024'
    },
    {
      status: 'live',
      title: 'Progressive Muscle Relaxation',
      description: 'Guided somatic sessions that systematically tense and release muscle groups to physically discharge stress stored in the body.',
      icon: Layers,
      quarter: 'Q4 2024'
    },
    {
      status: 'live',
      title: 'Spatial Audio Soundscapes',
      description: 'Generative, non-looping ambient environments. Mixes brown noise with binaural beats (Delta/Theta) and spatial panning to entrain brainwaves.',
      icon: Music,
      quarter: 'Q4 2024'
    },
    {
      status: 'live',
      title: 'Instant Load Architecture',
      description: 'Implemented lazy loading and code splitting strategies to ensure the main interface renders immediately, deferring heavy assets until needed.',
      icon: Zap,
      quarter: 'Q4 2024'
    },
    {
      status: 'planned',
      title: 'Resonance Breathing Tuner',
      description: 'Customizable breath pacing to help users find their personal resonance frequency (typically 5.5-6 bpm), maximizing Heart Rate Variability (HRV).',
      icon: Sliders,
      quarter: 'Future'
    },
    {
      status: 'concept',
      title: 'OLED "Midnight" Mode',
      description: 'A true-black theme option designed specifically to minimize photon emission on OLED screens for users with extreme light sensitivity.',
      icon: Palette,
      quarter: 'Future'
    },
    {
      status: 'concept',
      title: 'Typography 2.0',
      description: 'Curating a bespoke serif font pairing with improved optical sizing. Focusing on maximum legibility in low-contrast, low-light environments.',
      icon: Type,
      quarter: 'Future'
    },
    {
      status: 'future',
      title: 'Panic SOS Mode',
      description: 'One-tap "Physiological Sigh" intervention designed to mechanically offload carbon dioxide and halt acute anxiety spikes immediately.',
      icon: LifeBuoy,
      quarter: 'Future'
    },
    {
      status: 'future',
      title: 'Smart Wake Alarm',
      description: 'Intelligent alarm that monitors movement to wake you during your lightest sleep phase, preventing sleep inertia (grogginess).',
      icon: AlarmClock,
      quarter: 'Future'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  return (
    <motion.div 
      className="pb-24 pt-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <header className="mb-8">
        <h1 className="text-3xl font-serif text-stone-100 mb-2">Design Roadmap</h1>
        <p className="text-stone-500 text-sm">Our commitment to crafting the most calming digital experience.</p>
      </header>

      <div className="relative border-l-2 border-stone-800 ml-4 space-y-12">
        {milestones.map((item, idx) => (
          <motion.div key={idx} className="relative pl-8 group" variants={itemVariants}>
            {/* Timeline Dot */}
            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 transition-colors z-10 ${
                item.status === 'live'
                ? 'bg-green-900 border-green-500'
                : item.status === 'planned' 
                ? 'bg-orange-900 border-orange-500' 
                : 'bg-stone-900 border-stone-700 group-hover:border-stone-500'
            }`}></div>
            
            <div className={`bg-stone-900/40 border rounded-2xl p-5 transition-all relative overflow-hidden ${
                item.status === 'live' 
                ? 'border-green-900/30 bg-green-900/5' 
                : 'border-stone-800 hover:bg-stone-900/60 hover:border-orange-900/30'
            }`}>
                <div className="flex justify-between items-start mb-3 relative z-10">
                    <div className={`p-2 rounded-lg ${item.status === 'live' ? 'bg-green-900/20 text-green-400' : 'bg-stone-800/50 text-stone-300'}`}>
                        <item.icon size={20} />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                        item.status === 'live'
                        ? 'bg-green-900/20 text-green-300 border border-green-900/30'
                        : item.status === 'planned' 
                        ? 'bg-orange-900/20 text-orange-300 border border-orange-900/30' 
                        : 'bg-stone-800 text-stone-500 border border-stone-700'
                    }`}>
                        {item.status === 'live' ? 'Released' : item.quarter}
                    </span>
                </div>
                
                <h3 className={`text-lg font-serif mb-2 transition-colors relative z-10 ${item.status === 'live' ? 'text-green-100' : 'text-stone-200 group-hover:text-orange-100'}`}>
                    {item.title}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed relative z-10">
                    {item.description}
                </p>

                {item.status === 'planned' && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-orange-400/80 relative z-10">
                        <Circle size={8} className="fill-current animate-pulse" />
                        In Development
                    </div>
                )}
            </div>
          </motion.div>
        ))}
        
        {/* Completed Example */}
        <motion.div className="relative pl-8 opacity-60" variants={itemVariants}>
             <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-stone-800 border-2 border-green-900">
                 <CheckCircle2 size={12} className="text-green-700 -ml-[1px] -mt-[1px]" />
             </div>
             <div className="p-5 pt-1">
                <h3 className="text-sm font-medium text-stone-400 line-through decoration-stone-600">Warm Stone UI Theme</h3>
                <p className="text-xs text-stone-600">Released in v1.0</p>
             </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Roadmap;