import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Wind, Brain, Waves, Volume2, StopCircle, Layers, RefreshCcw, Smartphone, Music, Headphones, BookOpen, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Mode = 'BREATHE' | 'SHUFFLE' | 'NSDR' | 'PMR' | 'SOUNDS';

type SoundPreset = {
  id: string;
  name: string;
  description: string;
  baseFreq: number; // Hz (Carrier)
  beatFreq: number; // Hz (Difference - Brainwave target)
  noiseType: 'pink' | 'brown';
};

const SOUND_PRESETS: SoundPreset[] = [
  { id: 'delta', name: 'Cosmic Delta', description: 'Deep Sleep (0.5 - 4Hz). Heavy brown noise with slow entrainment for deep restorative rest.', baseFreq: 100, beatFreq: 2, noiseType: 'brown' },
  { id: 'theta', name: 'Lucid Theta', description: 'Dreaming & Creativity (4 - 8Hz). Pink noise wash for meditative drift and visual imagery.', baseFreq: 200, beatFreq: 6, noiseType: 'pink' },
  { id: 'alpha', name: 'Solar Alpha', description: 'Relaxed Focus (8 - 14Hz). Lighter masking for reading or winding down before bed.', baseFreq: 300, beatFreq: 10, noiseType: 'pink' },
];

const SHUFFLE_WORDS = [
  "Feather", "Brick", "Toaster", "Cloud", "Pebble", "Velvet", "Acorn", "Button", "Cactus", "Daisy", 
  "Easel", "Fossil", "Guitar", "Hammock", "Igloo", "Jellyfish", "Kettle", "Lantern", "Marble", "Notebook", 
  "Origami", "Pumpkin", "Quartz", "Ribbon", "Seashell", "Thimble", "Violin", "Windmill", "Yogurt", "Zucchini", 
  "Anchor", "Biscuit", "Compass", "Domino", "Envelope", "Firefly", "Gazebo", "Horseshoe", "Icicle", "Jigsaw", 
  "Kayak", "Lighthouse", "Magnet", "Needle", "Omelet", "Parasol", "Quill", "Radiator", "Sandal", "Teapot", 
  "Unicycle", "Vacuum", "Waffle", "Xylophone", "Yo-yo", "Zipper", "Balloon", "Chalk", "Donut", "Eraser", 
  "Flute", "Glove", "Helmet", "Island", "Juice", "Ladder", "Muffin", "Napkin", "Olive", "Piano", 
  "Rocket", "Spoon", "Tomato", "Umbrella", "Wheel"
];

const NSDR_SESSIONS = [
  {
    id: 'rapid-reset',
    title: 'Rapid Reset',
    duration: '5 Min',
    description: 'A quick body scan to reset dopamine levels and reduce acute stress.',
    script: `Lie down flat on your back. Close your eyes. Take a deep inhale through your nose... and a long, audible sigh out through your mouth. 
    
    Bring your awareness to the contact points between your body and the surface beneath you. Feel the weight of your heels... the back of your legs... your hips... your shoulders... and the back of your head. 
    
    Now, we will rotate consciousness through the body. As I name a part, simply feel it. Do not move it. 
    
    Bring awareness to your right hand thumb. Index finger. Middle finger. Ring finger. Little finger. Palm of the hand. Back of the hand. Wrist. Forearm. Elbow. Upper arm. Shoulder. 
    
    Move to the left hand thumb. Index finger. Middle finger. Ring finger. Little finger. Palm. Wrist. Forearm. Elbow. Shoulder. 
    
    Feel both arms heavy and relaxed. 
    
    Awareness to the chest center. Allow it to soften. Awareness to the abdomen. Rising and falling effortlessly. 
    
    You are completely supported. There is nothing to do. Nowhere to go. Just be.`
  },
  {
    id: 'learning-consolidation',
    title: 'Learning Consolidation',
    duration: '8 Min',
    description: 'Deep rest protocol to accelerate neuroplasticity after a study session.',
    script: `This is a protocol for deep rest to support the brain's ability to rewire itself. Please find a comfortable position where you will not be disturbed. 
    
    In this state of Non-Sleep Deep Rest, you are hovering between wakefulness and sleep. This is where the brain consolidates new information.
    
    Visualize a warm, golden light hovering just above the crown of your head. Imagine this light slowly moving down, touching your scalp and relaxing the tiny muscles there. 
    
    The light moves down to your forehead, smoothing out any furrowed lines. Down to your eyes, allowing them to sink deep into their sockets. Your jaw unhinges slightly, tongue resting on the floor of the mouth.
    
    The light flows down to your neck, into your chest, warming your heart center. It flows down your spine, vertebrae by vertebrae, releasing tension. 
    
    Your entire body is becoming a vessel of light and relaxation. With every exhale, you sink deeper. Deeper into the surface. Deeper into rest.`
  }
];

const PMR_STEPS = [
    {
        group: 'Hands & Arms',
        instruction: 'Clench your fists tight. Squeeze your forearms. Feel the tension.',
        duration: 5000,
        type: 'tense'
    },
    {
        group: 'Hands & Arms',
        instruction: 'Release. Let your arms flop down. Feel the warmth flowing into your fingertips.',
        duration: 10000,
        type: 'relax'
    },
    {
        group: 'Shoulders',
        instruction: 'Shrug your shoulders up towards your ears. Hold them tight.',
        duration: 5000,
        type: 'tense'
    },
    {
        group: 'Shoulders',
        instruction: 'Drop them. Let gravity take over. Feel the weight falling off.',
        duration: 10000,
        type: 'relax'
    },
    {
        group: 'Face',
        instruction: 'Wrinkle your forehead, squeeze eyes shut, clench jaw. Make a tight face.',
        duration: 5000,
        type: 'tense'
    },
    {
        group: 'Face',
        instruction: 'Smooth it out. Soften your jaw. Let your face become blank.',
        duration: 10000,
        type: 'relax'
    },
    {
        group: 'Stomach',
        instruction: 'Squeeze your abdominal muscles inward. Tighten your core.',
        duration: 5000,
        type: 'tense'
    },
    {
        group: 'Stomach',
        instruction: 'Release outward. Let your breath flow deep into your belly.',
        duration: 10000,
        type: 'relax'
    },
    {
        group: 'Legs & Feet',
        instruction: 'Point your toes. Tighten calves and thighs. Squeeze hard.',
        duration: 5000,
        type: 'tense'
    },
    {
        group: 'Legs & Feet',
        instruction: 'Let go completely. Feel yourself sinking into the surface.',
        duration: 10000,
        type: 'relax'
    },
    {
        group: 'Full Body',
        instruction: 'Scan for any remaining tension. You are completely at rest.',
        duration: 0, // End
        type: 'done'
    }
];

const RelaxationTools: React.FC = () => {
  const [mode, setMode] = useState<Mode>('BREATHE');
  const [isActive, setIsActive] = useState(false);

  // Breathing State
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Ready'>('Ready');
  const [hapticsEnabled, setHapticsEnabled] = useState(false);
  const hapticsRef = useRef(hapticsEnabled); // Ref to avoid resetting breathing cycle when toggled
  
  // Shuffle State
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // NSDR State (Self-Guided)
  const [activeNSDR, setActiveNSDR] = useState<string | null>(null);

  // PMR State
  const [pmrStepIndex, setPmrStepIndex] = useState(0);
  
  // Soundscape State
  const [soundActive, setSoundActive] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<any[]>([]);

  // Keep ref in sync
  useEffect(() => {
    hapticsRef.current = hapticsEnabled;
  }, [hapticsEnabled]);

  // --- Audio Engine (Web Audio API) ---
  const stopAudio = () => {
    if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
    }
    audioNodesRef.current = [];
    setSoundActive(null);
  };

  const playSoundscape = async (preset: SoundPreset) => {
      // 1. Cleanup
      if (soundActive) stopAudio();
      
      // 2. Init Context
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;
      setSoundActive(preset.id);

      // 3. Create Noise (Pink/Brown)
      const bufferSize = ctx.sampleRate * 5; // 5 seconds loop
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0;
      
      for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          // Simple Brown Noise Filter
          if (preset.noiseType === 'brown') {
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5; // Compensate gain
          } else {
            // Simple Pink Noise approximation
            const b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            // (Implementation of Paul Kellett's refined method usually goes here, simplified for this demo:)
            data[i] = (lastOut + (0.05 * white)) / 1.05; // Making it softer than white
             lastOut = data[i];
          }
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;
      
      // Spatial Noise Panner (Slow orbit)
      const noisePanner = ctx.createStereoPanner();
      const noiseLFO = ctx.createOscillator();
      noiseLFO.frequency.value = 0.1; // Very slow orbit (10s)
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.3; // 30% pan depth
      noiseLFO.connect(lfoGain);
      lfoGain.connect(noisePanner.pan);
      noiseLFO.start();

      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.15; // Base volume

      noiseSource.connect(noisePanner).connect(noiseGain).connect(ctx.destination);
      noiseSource.start();

      // 4. Binaural Beats (Dual Oscillators)
      const leftOsc = ctx.createOscillator();
      const rightOsc = ctx.createOscillator();
      const leftPan = ctx.createStereoPanner();
      const rightPan = ctx.createStereoPanner();
      const beatGain = ctx.createGain();

      leftOsc.type = 'sine';
      rightOsc.type = 'sine';
      leftOsc.frequency.value = preset.baseFreq;
      rightOsc.frequency.value = preset.baseFreq + preset.beatFreq;

      leftPan.pan.value = -1; // Left Ear
      rightPan.pan.value = 1; // Right Ear
      beatGain.gain.value = 0.05; // Subtle mixing

      leftOsc.connect(leftPan).connect(beatGain);
      rightOsc.connect(rightPan).connect(beatGain);
      beatGain.connect(ctx.destination);

      leftOsc.start();
      rightOsc.start();

      // Store nodes to stop later
      audioNodesRef.current = [noiseSource, leftOsc, rightOsc, noiseLFO];
  };

  useEffect(() => {
      // Cleanup on unmount
      return () => {
          stopAudio();
      }
  }, []);

  // --- Breathing Logic ---
  useEffect(() => {
    let isCancelled = false;

    if (mode === 'BREATHE' && isActive) {
      const runCycle = async () => {
        if (isCancelled) return;
        
        // INHALE (4s)
        setBreathPhase('Inhale'); 
        if (hapticsRef.current && navigator.vibrate) navigator.vibrate(70); // Single tap cue
        await new Promise(r => setTimeout(r, 4000));
        
        if (isCancelled) return;
        
        // HOLD (7s)
        setBreathPhase('Hold'); 
        if (hapticsRef.current && navigator.vibrate) navigator.vibrate([40, 60, 40]); // Double tap cue
        await new Promise(r => setTimeout(r, 7000));
        
        if (isCancelled) return;
        
        // EXHALE (8s)
        setBreathPhase('Exhale'); 
        if (hapticsRef.current && navigator.vibrate) navigator.vibrate(400); // Long tap cue
        await new Promise(r => setTimeout(r, 8000));
        
        if (!isCancelled) runCycle(); 
      };
      runCycle();
    } else if (mode === 'BREATHE') {
      setBreathPhase('Ready');
    }
    
    return () => {
      isCancelled = true;
    };
  }, [isActive, mode]);

  // --- Shuffle Logic ---
  useEffect(() => {
    if (mode === 'SHUFFLE' && isActive) {
        // Random start
        setCurrentWordIndex(Math.floor(Math.random() * SHUFFLE_WORDS.length));
        
        const interval = setInterval(() => {
            setCurrentWordIndex(prev => (prev + 1) % SHUFFLE_WORDS.length);
        }, 8000); // New word every 8 seconds
        
        return () => clearInterval(interval);
    }
  }, [isActive, mode]);

  // --- PMR Logic ---
  useEffect(() => {
      let timeout: ReturnType<typeof setTimeout>;
      if (mode === 'PMR' && isActive && pmrStepIndex < PMR_STEPS.length) {
          const step = PMR_STEPS[pmrStepIndex];
          if (step.type === 'done') {
              setIsActive(false);
              return;
          }

          timeout = setTimeout(() => {
              setPmrStepIndex(prev => prev + 1);
          }, step.duration);
      }
      return () => clearTimeout(timeout);
  }, [mode, isActive, pmrStepIndex]);


  const toggleActive = () => {
      if (mode === 'PMR') {
          if (!isActive && pmrStepIndex >= PMR_STEPS.length - 1) {
              setPmrStepIndex(0); // Restart if finished
          }
      }
      setIsActive(!isActive);
  };

  const getBreathConfig = () => {
    switch (breathPhase) {
      case 'Inhale':
        return {
          scale: 'scale-125',
          ringColor: 'border-orange-500/40',
          glow: 'shadow-[0_0_60px_rgba(251,146,60,0.2)]',
          duration: 'duration-[4000ms]',
          subtext: 'Nasal Inhale',
          coreColor: 'bg-stone-800'
        };
      case 'Hold':
        return {
          scale: 'scale-125',
          ringColor: 'border-orange-500/60',
          glow: 'shadow-[0_0_80px_rgba(251,146,60,0.3)]',
          duration: 'duration-1000',
          subtext: 'Hold...',
          coreColor: 'bg-stone-800'
        };
      case 'Exhale':
        return {
          scale: 'scale-75',
          ringColor: 'border-stone-700',
          glow: 'shadow-none',
          duration: 'duration-[8000ms]',
          subtext: 'Mouth Exhale',
          coreColor: 'bg-stone-900'
        };
      default:
        return {
          scale: 'scale-100',
          ringColor: 'border-stone-800',
          glow: 'shadow-none',
          duration: 'duration-700',
          subtext: '4-7-8 Pattern',
          coreColor: 'bg-stone-900'
        };
    }
  };

  const config = getBreathConfig();
  const currentPmrStep = PMR_STEPS[pmrStepIndex];

  return (
    <div className="h-full flex flex-col pt-6 pb-24">
      
      {/* Tab Switcher */}
      <div className="flex bg-stone-900/80 p-1 rounded-full border border-stone-800 mb-8 w-fit mx-auto shadow-lg backdrop-blur-md overflow-x-auto max-w-full z-20">
        <button 
            onClick={() => { setMode('BREATHE'); setIsActive(false); stopAudio(); }}
            className={`px-3 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${mode === 'BREATHE' ? 'bg-stone-700 text-stone-100 shadow-sm' : 'text-stone-500 hover:text-stone-400'}`}
        >
            <Wind size={14} /> Breath
        </button>
        <button 
            onClick={() => { setMode('SHUFFLE'); setIsActive(false); stopAudio(); }}
            className={`px-3 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${mode === 'SHUFFLE' ? 'bg-stone-700 text-stone-100 shadow-sm' : 'text-stone-500 hover:text-stone-400'}`}
        >
            <Brain size={14} /> Shuffle
        </button>
        <button 
            onClick={() => { setMode('PMR'); setIsActive(false); stopAudio(); }}
            className={`px-3 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${mode === 'PMR' ? 'bg-stone-700 text-stone-100 shadow-sm' : 'text-stone-500 hover:text-stone-400'}`}
        >
            <Layers size={14} /> PMR
        </button>
        <button 
            onClick={() => { setMode('NSDR'); setIsActive(false); stopAudio(); }}
            className={`px-3 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${mode === 'NSDR' ? 'bg-stone-700 text-stone-100 shadow-sm' : 'text-stone-500 hover:text-stone-400'}`}
        >
            <Waves size={14} /> NSDR
        </button>
        <button 
            onClick={() => { setMode('SOUNDS'); setIsActive(false); }}
            className={`px-3 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${mode === 'SOUNDS' ? 'bg-stone-700 text-stone-100 shadow-sm' : 'text-stone-500 hover:text-stone-400'}`}
        >
            <Music size={14} /> Sounds
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] w-full relative">
        
        {/* BREATHING UI */}
        {mode === 'BREATHE' && (
            <>
                {/* Haptics Toggle */}
                <button
                    onClick={() => setHapticsEnabled(!hapticsEnabled)}
                    className={`absolute top-0 right-4 p-2 rounded-full transition-colors ${hapticsEnabled ? 'text-orange-400 bg-orange-900/20' : 'text-stone-600 hover:text-stone-400'}`}
                    title="Toggle Haptic Cues"
                >
                    <Smartphone size={16} />
                </button>

                <div className="relative flex items-center justify-center w-80 h-80">
                    <div 
                    className={`absolute w-full h-full rounded-full bg-orange-900/10 blur-3xl transition-all ease-in-out ${config.duration} ${breathPhase === 'Inhale' || breathPhase === 'Hold' ? 'opacity-100 scale-100' : 'opacity-20 scale-75'}`} 
                    />
                    <div 
                        className={`absolute w-64 h-64 rounded-full border-2 transition-all ease-linear ${config.duration} ${config.scale} ${config.ringColor} ${config.glow} opacity-100`}
                    />
                    <div 
                        className={`relative w-48 h-48 rounded-full border border-stone-700/50 flex flex-col items-center justify-center transition-all ease-in-out ${config.duration} ${config.coreColor} z-10`}
                    >
                        <span className="text-3xl font-light text-stone-200 tracking-widest animate-fade-in key-{breathPhase}">
                            {breathPhase}
                        </span>
                        <span className="text-xs text-stone-500 mt-2 font-mono uppercase tracking-wider transition-colors duration-500">
                            {config.subtext}
                        </span>
                    </div>
                </div>
            </>
        )}

        {/* SHUFFLE UI */}
        {mode === 'SHUFFLE' && (
            <div className="text-center px-6 animate-fade-in w-full max-w-sm">
                <div className="mb-12 text-sm text-stone-500">Visualize each object in detail for 8 seconds</div>
                <div className={`text-4xl font-serif text-orange-100 transition-all duration-1000 transform ${isActive ? 'opacity-100 scale-100 translate-y-0' : 'opacity-50 blur-sm scale-95 translate-y-4'}`}>
                    {isActive ? SHUFFLE_WORDS[currentWordIndex] || "Ready" : "Ready"}
                </div>
                
                {isActive && (
                    <div className="mt-12 relative w-full h-1 bg-stone-900 rounded-full overflow-hidden">
                        <div className="absolute top-0 left-0 h-full bg-stone-700 animate-[width_8s_linear_infinite]" style={{ width: '0%' }}></div>
                    </div>
                )}

                {!isActive && (
                    <p className="mt-12 text-stone-600 text-xs leading-relaxed max-w-xs mx-auto border-t border-stone-900 pt-6">
                        "Serial Diverse Imagining" helps scramble the brain's visual cortex, preventing it from holding onto stressful looping thoughts.
                    </p>
                )}
            </div>
        )}

        {/* PMR UI */}
        {mode === 'PMR' && (
             <div className="flex flex-col items-center text-center animate-fade-in w-full max-w-xs">
                {currentPmrStep.type === 'done' ? (
                     <div className="text-stone-300 flex flex-col items-center gap-4">
                        <div className="w-24 h-24 rounded-full bg-stone-800 flex items-center justify-center border border-stone-700">
                            <Layers size={32} className="text-stone-500" />
                        </div>
                        <h3 className="text-xl font-serif">Session Complete</h3>
                        <p className="text-sm text-stone-500">Body tension discharged.</p>
                        <button onClick={() => setPmrStepIndex(0)} className="mt-4 flex items-center gap-2 text-xs text-orange-400 hover:text-orange-300">
                            <RefreshCcw size={14} /> Restart
                        </button>
                     </div>
                ) : (
                    <>
                         <div className="mb-8 h-12 flex items-center">
                            <h3 className={`text-2xl font-serif transition-colors duration-500 ${currentPmrStep.type === 'tense' ? 'text-red-200' : 'text-stone-200'}`}>
                                {isActive ? currentPmrStep.group : "Progressive Muscle Relaxation"}
                            </h3>
                         </div>

                         <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                            <AnimatePresence mode="wait">
                                {isActive && (
                                    <motion.div 
                                        key={currentPmrStep.type}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={
                                            currentPmrStep.type === 'tense' 
                                            ? { 
                                                opacity: 1, 
                                                scale: 1,
                                                x: [0, -2, 2, -2, 2, 0],
                                            }
                                            : { 
                                                opacity: 1, 
                                                scale: [1, 1.1, 1],
                                                x: 0
                                            }
                                        }
                                        transition={
                                             currentPmrStep.type === 'tense' 
                                             ? { x: { repeat: Infinity, duration: 0.2 }, duration: 0.3 }
                                             : { scale: { duration: 4, repeat: Infinity, repeatType: "reverse" }, duration: 1 }
                                        }
                                        className={`w-48 h-48 rounded-full flex items-center justify-center border-4 backdrop-blur-sm transition-colors duration-700 ${
                                            currentPmrStep.type === 'tense' 
                                            ? 'border-red-900/50 bg-red-900/10 text-red-200 shadow-[0_0_40px_rgba(153,27,27,0.3)]' 
                                            : 'border-teal-900/30 bg-teal-900/5 text-stone-200 shadow-[0_0_40px_rgba(20,184,166,0.1)]'
                                        }`}
                                    >
                                        <div className="text-center px-4">
                                            <span className={`text-xl font-bold tracking-widest block mb-2 ${currentPmrStep.type === 'tense' ? 'text-red-400' : 'text-teal-400'}`}>
                                                {currentPmrStep.type === 'tense' ? 'SQUEEZE' : 'RELEASE'}
                                            </span>
                                            {currentPmrStep.type === 'tense' && <span className="text-xs text-red-300/70 uppercase font-mono">Hold Tight</span>}
                                            {currentPmrStep.type === 'relax' && <span className="text-xs text-teal-300/70 uppercase font-mono">Let Go</span>}
                                        </div>
                                    </motion.div>
                                )}
                                {!isActive && (
                                     <div className="w-48 h-48 rounded-full flex items-center justify-center border-4 border-stone-800 bg-stone-900/50">
                                         <span className="text-xs text-stone-500 uppercase tracking-widest">Ready</span>
                                     </div>
                                )}
                            </AnimatePresence>
                         </div>

                         <div className="h-16 relative w-full">
                            <AnimatePresence mode="wait">
                                <motion.p 
                                    key={pmrStepIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-sm text-stone-400 leading-relaxed"
                                >
                                    {isActive ? currentPmrStep.instruction : "Systematically tense and release muscles to discharge physical stress."}
                                </motion.p>
                            </AnimatePresence>
                         </div>
                    </>
                )}
             </div>
        )}

        {/* NSDR UI (Script Reader) */}
        {mode === 'NSDR' && (
            <div className="w-full max-w-sm px-4 animate-fade-in h-full flex flex-col">
                {activeNSDR ? (
                     <div className="flex flex-col h-full bg-stone-900/50 rounded-2xl border border-stone-800 p-6 overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <button onClick={() => setActiveNSDR(null)} className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-300 transition-colors">
                                <ArrowLeft size={16} /> Back
                            </button>
                            <span className="text-[10px] font-bold text-teal-400 tracking-widest uppercase">Self-Guided Mode</span>
                        </div>
                        <h3 className="text-2xl font-serif text-stone-200 mb-6">{NSDR_SESSIONS.find(s => s.id === activeNSDR)?.title}</h3>
                        
                        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-stone-800">
                             <div className="prose prose-invert prose-p:text-stone-400 prose-p:font-serif prose-p:text-lg prose-p:leading-relaxed">
                                {NSDR_SESSIONS.find(s => s.id === activeNSDR)?.script.split('\n').map((para, i) => (
                                    para.trim() && <p key={i} className="mb-4">{para}</p>
                                ))}
                             </div>
                        </div>
                        <p className="mt-4 text-xs text-center text-stone-600">Memorize the sequence, then close your eyes.</p>
                     </div>
                ) : (
                    <>
                        <div className="text-center mb-6 shrink-0">
                            <h3 className="text-lg font-medium text-stone-200">Non-Sleep Deep Rest</h3>
                            <p className="text-xs text-stone-500 mt-1">Self-guided protocols to restore dopamine.</p>
                        </div>
                        <div className="space-y-4 overflow-y-auto pb-4 pr-1 scrollbar-thin scrollbar-thumb-stone-800">
                            {NSDR_SESSIONS.map((session) => (
                                <button
                                    key={session.id}
                                    onClick={() => setActiveNSDR(session.id)}
                                    className="w-full bg-stone-900/60 border border-stone-800 hover:border-teal-900/50 hover:bg-stone-900 p-4 rounded-xl text-left group transition-all relative overflow-hidden"
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-stone-300 group-hover:text-teal-100 transition-colors">{session.title}</h4>
                                        <span className="text-[10px] font-mono text-stone-600 bg-stone-950 px-2 py-0.5 rounded">{session.duration}</span>
                                    </div>
                                    <p className="text-xs text-stone-500 leading-relaxed pr-8">{session.description}</p>
                                    <div className="absolute bottom-4 right-4 text-stone-700 group-hover:text-teal-500 transition-colors">
                                         <BookOpen size={18} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        )}

        {/* SOUNDSCAPES UI */}
        {mode === 'SOUNDS' && (
             <div className="w-full max-w-sm px-4 animate-fade-in">
                 <div className="text-center mb-8">
                     <h3 className="text-lg font-medium text-stone-200 flex items-center justify-center gap-2">
                        <Headphones size={20} className="text-purple-400" />
                        Spatial Audio Gen
                     </h3>
                     <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                        Real-time generative audio. Binaural beats require headphones to create the phantom pulse in your brain.
                     </p>
                 </div>

                 <div className="space-y-4">
                     {SOUND_PRESETS.map((preset) => (
                         <button
                            key={preset.id}
                            onClick={() => soundActive === preset.id ? stopAudio() : playSoundscape(preset)}
                            className={`w-full p-5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                                soundActive === preset.id 
                                ? 'bg-purple-900/20 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.1)]' 
                                : 'bg-stone-900/40 border-stone-800 hover:bg-stone-900'
                            }`}
                         >
                            {/* Visualizer BG for active */}
                            {soundActive === preset.id && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                                     <div className="w-full h-1 bg-purple-500/50 animate-[pulse_4s_ease-in-out_infinite]"></div>
                                </div>
                            )}

                             <div className="flex justify-between items-start relative z-10">
                                 <div>
                                     <h4 className={`font-serif text-lg mb-1 ${soundActive === preset.id ? 'text-purple-200' : 'text-stone-300'}`}>{preset.name}</h4>
                                     <p className="text-xs text-stone-500 leading-relaxed pr-8">{preset.description}</p>
                                 </div>
                                 <div className={`p-3 rounded-full transition-colors ${soundActive === preset.id ? 'bg-purple-500 text-stone-900' : 'bg-stone-800 text-stone-600'}`}>
                                     {soundActive === preset.id ? <StopCircle size={20} /> : <Play size={20} />}
                                 </div>
                             </div>
                         </button>
                     ))}
                 </div>
             </div>
        )}

      </div>

      {/* Controls (Only for Breathe, Shuffle, PMR) */}
      {(mode === 'BREATHE' || mode === 'SHUFFLE' || (mode === 'PMR' && currentPmrStep.type !== 'done')) && (
          <div className="flex justify-center mt-8">
                <button
                    onClick={toggleActive}
                    className={`px-10 py-5 rounded-2xl flex items-center gap-3 transition-all transform active:scale-95
                    ${isActive 
                        ? 'bg-stone-900 text-stone-400 border border-stone-800' 
                        : 'bg-gradient-to-r from-orange-900/90 to-stone-800 text-orange-100 border border-orange-700/50 hover:shadow-lg hover:shadow-orange-900/20'
                    }`}
                >
                    {isActive ? <Pause size={20} /> : <Play size={20} />}
                    <span className="font-medium tracking-wide">{isActive ? 'Pause' : 'Start'}</span>
                </button>
          </div>
      )}
    </div>
  );
};

export default RelaxationTools;