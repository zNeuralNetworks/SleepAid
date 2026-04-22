import React, { useState, useEffect } from 'react';
import { Moon, Sunrise, Coffee, Sun, Sunset, Smartphone, Check, Thermometer, EyeOff, VolumeX, Lightbulb, Clock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
};

const SLEEP_FACTS = [
    "Your brain 'washes' itself with cerebrospinal fluid during deep sleep (the Glymphatic System) to remove toxic proteins.",
    "Humans are the only mammals that willingly delay sleep.",
    "Sleep deprivation suppresses the immune system's killer T-cells by up to 70% after just one bad night.",
    "REM sleep (Dreaming) is essential for emotional processing and memory consolidation.",
    "A 'cool' room (65-68°F) signals the body it is time to release melatonin.",
    "Waking up at the same time every day anchors your circadian rhythm better than going to bed at the same time."
];

const Dashboard: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [randomFact, setRandomFact] = useState("");

  useEffect(() => {
    // Initial Fact
    setRandomFact(SLEEP_FACTS[Math.floor(Math.random() * SLEEP_FACTS.length)]);
    
    // Update time every minute
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // --- BIOLOGY ENGINE ---
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const timeAsFloat = currentHour + currentMinute / 60;

  // 1. SLEEP PRESSURE (Process S)
  const WAKE_TIME = 7; 
  const hoursAwake = timeAsFloat < WAKE_TIME 
    ? (24 - WAKE_TIME) + timeAsFloat 
    : timeAsFloat - WAKE_TIME;
  const sleepPressure = Math.min(Math.max((hoursAwake / 16) * 100, 0), 100);

  // 2. CIRCADIAN RHYTHM (Process C)
  // Calculate progress starting from 6 AM (0%) to 6 AM next day (100%)
  let timelineProgress = ((timeAsFloat - 6) / 24) * 100;
  if (timelineProgress < 0) timelineProgress += 100;

  let PhaseIcon = Sun;
  let phaseText = "";
  let phaseColor = "text-stone-400";
  let phaseDescription = "";
  
  if (currentHour >= 6 && currentHour < 10) {
      phaseText = "Cortisol Awakening";
      PhaseIcon = Sunrise;
      phaseColor = "text-yellow-500";
      phaseDescription = "View bright light now to anchor your rhythm.";
  } else if (currentHour >= 10 && currentHour < 17) {
      phaseText = "Peak Alertness";
      PhaseIcon = Sun;
      phaseColor = "text-orange-500";
      phaseDescription = "Ideal time for cognitive work and exercise.";
  } else if (currentHour >= 17 && currentHour < 21) {
      phaseText = "Dim Light Melatonin Onset";
      PhaseIcon = Sunset;
      phaseColor = "text-indigo-400";
      phaseDescription = "Avoid bright overhead lights. Use warm lamps.";
  } else {
      phaseText = "Biological Darkness";
      PhaseIcon = Moon;
      phaseColor = "text-purple-400";
      phaseDescription = "Melatonin is secreting. Prepare for sleep.";
  }

  // 3. CAFFEINE LOGIC
  const CAFFEINE_CUTOFF_HOUR = 14; // 2 PM
  const isCaffeineRisky = currentHour >= CAFFEINE_CUTOFF_HOUR;

  // 4. SLEEP CYCLES (90 mins)
  const calculateWakeTime = (cycles: number) => {
      const d = new Date(now);
      d.setMinutes(d.getMinutes() + 15 + (cycles * 90)); // +15 min avg latency
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div 
      className="space-y-6 pb-24 text-stone-200"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.header variants={itemVariants} className="flex justify-between items-center mb-6 pt-4">
        <div>
          <h1 className="text-3xl font-serif font-medium text-stone-100">
            {currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening"}
          </h1>
          <p className="text-stone-500 text-sm mt-1">Bio-Time: {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center shadow-lg">
          <PhaseIcon size={20} className={phaseColor} />
        </div>
      </motion.header>

      {/* PROCESS S: Sleep Drive */}
      <motion.section variants={itemVariants} className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
        <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-medium text-stone-200 flex items-center gap-2">
                <Coffee className="text-stone-400" size={18} />
                Process S: Sleep Pressure
            </h2>
            <span className="text-xs text-orange-400 font-mono">{Math.round(sleepPressure)}% ADENOSINE</span>
        </div>
        <div className="w-full bg-stone-800 rounded-full h-4 overflow-hidden relative shadow-inner">
             <motion.div 
                className="bg-gradient-to-r from-stone-600 via-orange-900 to-orange-600 h-full rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${sleepPressure}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
             >
                <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-orange-300/50 shadow-[0_0_10px_rgba(251,146,60,1)]"></div>
             </motion.div>
        </div>
        <p className="text-xs text-stone-500 mt-3 leading-relaxed">
            {hoursAwake > 15 
             ? "Adenosine pressure is peaking. Sleep onset latency is minimal." 
             : "Adenosine is currently building. Avoid naps to protect tonight's sleep drive."}
        </p>
      </motion.section>

      {/* PROCESS C: Circadian Rhythm */}
      <motion.section variants={itemVariants} className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-stone-200 flex items-center gap-2">
                <Sun className="text-stone-400" size={18} />
                Process C: Circadian Rhythm
            </h2>
            <PhaseIcon size={16} className={phaseColor} />
        </div>
        
        <div className="relative h-12 w-full mb-2">
            {/* Timeline Bar */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-stone-800 rounded-full -translate-y-1/2"></div>
            
            {/* Markers */}
            <div className="absolute top-1/2 left-0 w-2 h-2 bg-yellow-600 rounded-full -translate-y-1/2 -translate-x-1/2" title="6 AM"></div>
            <div className="absolute top-1/2 left-[50%] w-2 h-2 bg-orange-600 rounded-full -translate-y-1/2 -translate-x-1/2" title="6 PM"></div>
            <div className="absolute top-1/2 right-0 w-2 h-2 bg-purple-600 rounded-full -translate-y-1/2 translate-x-1/2" title="6 AM"></div>

            {/* Current Position */}
            <motion.div 
                className="absolute top-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
                initial={{ left: '0%' }}
                animate={{ left: `${timelineProgress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ translateX: '-50%' }}
            >
                 <div className={`w-4 h-4 rounded-full border-2 border-stone-900 shadow-[0_0_15px_currentColor] ${phaseColor.replace('text', 'bg')}`}></div>
            </motion.div>
        </div>
        
        <div className="flex justify-between text-[10px] text-stone-600 font-mono uppercase tracking-widest mb-3">
            <span>Morning</span>
            <span>Evening</span>
            <span>Night</span>
        </div>

        <div className="bg-stone-950/30 rounded-xl p-3 border border-stone-800/50">
            <h3 className={`text-sm font-medium mb-1 ${phaseColor}`}>{phaseText}</h3>
            <p className="text-xs text-stone-500 leading-relaxed">{phaseDescription}</p>
        </div>
      </motion.section>

      {/* TECH HYGIENE: The Blue Light Myth */}
      <motion.section variants={itemVariants} className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4 relative z-10">
              <Smartphone size={18} className="text-purple-300" />
              <h2 className="text-lg font-medium text-stone-200">Tech Hygiene: The Lux Myth</h2>
          </div>
          
          <div className="grid grid-cols-[1fr_auto] gap-4 relative z-10">
               <div>
                   <p className="text-sm text-stone-300 leading-relaxed mb-3">
                       <strong className="text-orange-200">Fact:</strong> "Night Shift" (orange tint) is not enough. The <em>brightness</em> (intensity/lux) of the light is what primarily suppresses melatonin, not just the color.
                   </p>
                   <div className="bg-purple-900/20 border border-purple-500/30 p-3 rounded-xl">
                       <div className="flex items-center gap-2 mb-1">
                           <Eye size={14} className="text-purple-300" />
                           <span className="text-xs font-bold text-purple-200 uppercase">Pro Tip</span>
                       </div>
                       <p className="text-xs text-stone-400">
                           Enable <strong>"Reduce White Point"</strong> in your phone's Accessibility settings to dim the screen below the standard 0% brightness level.
                       </p>
                   </div>
               </div>
               <div className="flex flex-col items-center justify-center gap-2 bg-stone-950/50 p-2 rounded-xl border border-stone-800">
                    <div className="w-1.5 h-12 bg-gradient-to-t from-stone-800 via-stone-700 to-white rounded-full"></div>
                    <span className="text-[10px] text-stone-500 font-mono uppercase rotate-90 whitespace-nowrap mt-4">Lux Level</span>
               </div>
          </div>
      </motion.section>

      {/* CAFFEINE MONITOR */}
      <motion.section variants={itemVariants} className={`border rounded-2xl p-6 backdrop-blur-sm shadow-xl transition-colors duration-500 ${isCaffeineRisky ? 'bg-orange-900/10 border-orange-900/30' : 'bg-stone-900/50 border-stone-800'}`}>
          <div className="flex justify-between items-start mb-4">
              <h2 className={`text-lg font-medium flex items-center gap-2 ${isCaffeineRisky ? 'text-orange-200' : 'text-stone-200'}`}>
                  <Coffee size={18} className={isCaffeineRisky ? 'text-orange-400' : 'text-stone-400'} />
                  Caffeine Monitor
              </h2>
              <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${isCaffeineRisky ? 'bg-orange-900/40 text-orange-300' : 'bg-green-900/20 text-green-400'}`}>
                  {isCaffeineRisky ? 'Caution' : 'Safe Zone'}
              </span>
          </div>
          <div className="flex gap-4">
               <div className="w-1.5 rounded-full bg-stone-800 overflow-hidden relative">
                   <div className={`absolute bottom-0 w-full transition-all duration-1000 ${isCaffeineRisky ? 'h-3/4 bg-orange-500' : 'h-1/4 bg-green-500'}`}></div>
               </div>
               <div className="flex-1">
                   <p className="text-sm text-stone-300 leading-relaxed">
                       {isCaffeineRisky 
                        ? "Caffeine consumed now will remain in your system at bedtime (Half-life: ~5-7hrs). This blocks adenosine receptors and reduces deep sleep quality."
                        : "Consuming caffeine now is unlikely to disrupt sleep onset tonight."}
                   </p>
               </div>
          </div>
      </motion.section>

      {/* SLEEP CYCLES */}
      <motion.section variants={itemVariants} className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
          <div className="flex items-center gap-2 mb-4">
              <Clock size={18} className="text-teal-400" />
              <h2 className="text-lg font-medium text-stone-200">Sleep Math</h2>
          </div>
          <p className="text-xs text-stone-500 mb-4">If you fall asleep in ~15 mins, aim for these wake times to complete full 90-min cycles:</p>
          <div className="grid grid-cols-2 gap-3">
              <div className="bg-stone-800/50 p-3 rounded-xl border border-stone-700/50 text-center">
                  <div className="text-xl font-serif text-teal-100">{calculateWakeTime(5)}</div>
                  <div className="text-[10px] text-teal-500/80 uppercase tracking-widest mt-1">7.5 Hours (5 Cycles)</div>
              </div>
              <div className="bg-stone-800/50 p-3 rounded-xl border border-stone-700/50 text-center">
                  <div className="text-xl font-serif text-teal-100">{calculateWakeTime(6)}</div>
                  <div className="text-[10px] text-teal-500/80 uppercase tracking-widest mt-1">9 Hours (6 Cycles)</div>
              </div>
          </div>
      </motion.section>

      {/* BEDROOM AUDIT */}
      <motion.section variants={itemVariants} className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
          <div className="flex items-center gap-2 mb-4">
              <Check size={18} className="text-stone-400" />
              <h2 className="text-lg font-medium text-stone-200">Bedroom Audit</h2>
          </div>
          <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-950 border border-stone-800">
                  <Thermometer size={16} className="text-blue-400" />
                  <div className="flex-1">
                      <div className="text-sm text-stone-300 font-medium">Thermal Drop</div>
                      <div className="text-xs text-stone-500">Ideal: 65-68°F (18°C). Cool body = Sleepy body.</div>
                  </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-950 border border-stone-800">
                  <EyeOff size={16} className="text-stone-400" />
                  <div className="flex-1">
                      <div className="text-sm text-stone-300 font-medium">Photic Control</div>
                      <div className="text-xs text-stone-500">Blackout curtains or mask. Even dim LED light penetrates eyelids.</div>
                  </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-950 border border-stone-800">
                  <VolumeX size={16} className="text-stone-400" />
                  <div className="flex-1">
                      <div className="text-sm text-stone-300 font-medium">Acoustic Floor</div>
                      <div className="text-xs text-stone-500">Use 'Brown Noise' in the Relax tab to mask sudden sounds.</div>
                  </div>
              </div>
          </div>
      </motion.section>

      {/* DID YOU KNOW */}
      <motion.section variants={itemVariants} className="bg-stone-800/30 border border-stone-800 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={16} className="text-yellow-600" />
              <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Sleep Science</span>
          </div>
          <p className="text-sm text-stone-400 font-serif italic leading-relaxed">
              "{randomFact}"
          </p>
      </motion.section>

      <div className="text-center pt-8 pb-4">
          <p className="text-[10px] text-stone-600 uppercase tracking-widest font-mono">v1.4 • Offline Capable</p>
      </div>
    </motion.div>
  );
};

export default Dashboard;