import React, { useState } from 'react';
import { BookOpen, Feather, ArrowLeft, Clock } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  description: string;
  duration: string;
  content: string;
  tags: string[];
}

const PREMADE_STORIES: Story[] = [
  {
    id: 'rain-train',
    title: 'The Rain Train',
    description: 'Rhythmic travel through a misty mountain pass.',
    duration: '10 min',
    tags: ['Rhythm', 'Rain', 'Travel'],
    content: `You are seated comfortably in a wide, plush velvet seat of an old-fashioned train. The cabin is warm, lit by a soft, amber sconce on the wall. Outside the window, the world is a blur of deep greens and greys, softened by a gentle, steady rain.
    
    Listen to the sound of the rain against the glass. It taps a random, soothing pattern, a gentle static that washes away thoughts of the day. Beneath you, the rhythmic clack-clack... clack-clack... of the wheels on the tracks creates a steady heartbeat. It is a sound of progress, of moving forward without you needing to do anything at all. You are being carried. You are safe.
    
    The train sways gently, a rocking motion like a cradle. With every rock, your shoulders drop an inch lower. The tension in your jaw unspools. There is nowhere else you need to be. The destination is simply rest.
    
    Outside, the fog rolls over a sleeping forest. The trees are heavy with mist, standing still and silent as the train glides past. You feel the heaviness of your own eyelids now, mimicking the heavy boughs of the fir trees. The rhythmic motion continues... soothing... rocking... drifting... taking you deeper into the quiet night.`
  },
  {
    id: 'ancient-library',
    title: 'The Ancient Library',
    description: 'Dust motes and the smell of old paper in a quiet sanctuary.',
    duration: '12 min',
    tags: ['Quiet', 'Books', 'Nostalgia'],
    content: `Imagine you are walking into a vast, circular room. The ceiling is high, lost in shadow, but down here, amongst the shelves, the light is golden and dim. The air smells rich—of old paper, leather bindings, and polished oak. It is the smell of silence itself.
    
    You run your fingertips along the spines of the books. Some are rough and textured, others smooth and cool. You are the only one here. It is a sanctuary of knowledge that demands nothing from you. The books are sleeping, their stories resting between the pages, just as you are about to rest.
    
    You find a large, overstuffed leather armchair in a corner, bathed in the light of a single candle. As you sit, the leather creaks softly, accepting your weight. You sink down, feeling the support beneath your back, your legs, your arms.
    
    Dust motes dance slowly in the candlelight, swirling in lazy spirals. They move so slowly, as if time itself has slowed down in this room. Watch one dust mote drift... down... and down... settling on the arm of the chair. Your breathing slows to match this drift. Inhale the scent of old paper. Exhale the noise of the outside world. Here, there is only stillness.`
  },
  {
    id: 'winter-cabin',
    title: 'The Winter Cabin',
    description: 'A crackling fire while a snowstorm rages outside.',
    duration: '8 min',
    tags: ['Warmth', 'Fire', 'Cozy'],
    content: `The wind howls outside, but it is a distant, muffled sound, like the ocean far away. Inside, you are wrapped in a thick, wool blanket, sitting before a large stone hearth. The fire is the only light in the room, casting dancing shadows in orange and gold against the log walls.
    
    Watch the flames. They flicker and bow, consuming the wood in slow motion. Pop. A log shifts, settling deeper into the bed of glowing embers. The heat radiates outward, touching your face, warming your hands, penetrating deep into your muscles. It melts away the cold, melts away the stiffness of the day.
    
    You take a sip of warm herbal tea. The steam rises, curling into the air. The mug is hot against your palms, a grounding sensation. You are entirely sheltered here. The storm outside only emphasizes your safety inside.
    
    The heavy snow piles up against the window pane, insulating the cabin, creating a cocoon of silence. The world is covered in a white blanket, and now, so are you. Heavy, warm, and still.`
  },
  {
    id: 'slow-river',
    title: 'The Slow River',
    description: 'Drifting downstream on a flat-bottomed boat.',
    duration: '15 min',
    tags: ['Water', 'Nature', 'Flow'],
    content: `The water is dark and glassy, a perfect mirror of the twilight sky above. You are lying on your back in a wide, wooden boat, filled with soft cushions. There are no oars, for you do not need to row. The current is gentle and slow, carrying the boat effortlessly downstream.
    
    Above you, the first stars are beginning to pierce the indigo canvas of the sky. One... then another... blinking into existence. The air is cool and fresh, smelling of river water and damp earth.
    
    You hear the soft lap of water against the wood. Plip-plop. A gentle rhythm. The boat turns slowly in the current, a lazy rotation that makes your head feel pleasantly heavy. You trail one hand over the side, your fingers grazing the cool surface of the water, leaving a tiny wake that disappears instantly.
    
    The banks of the river are lined with tall reeds and weeping willows, their branches dipping into the stream. They pass by in a blur of soft shadows. You are moving away from the source, moving away from the day, drifting toward the vast, open ocean of sleep. Drifting... floating... sleeping.`
  }
];

const StoryMode: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const resetView = () => {
    setSelectedStory(null);
  };

  // Reader View Component
  const Reader = ({ title, content }: { title: string, content: string }) => (
    <div className="animate-fade-in h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
           <button onClick={resetView} className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-300 transition-colors">
               <ArrowLeft size={16} /> Library
           </button>
       </div>
       
       <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-stone-800">
            <div className="bg-stone-900/30 border border-stone-800/50 p-8 rounded-2xl shadow-inner max-w-2xl mx-auto">
                <h2 className="text-3xl font-serif text-orange-100 mb-8 text-center opacity-90 leading-tight">{title}</h2>
                <div className="prose prose-invert prose-p:text-stone-300 prose-p:font-serif prose-p:text-xl prose-p:leading-loose prose-p:tracking-wide">
                    {content.split('\n').map((para, i) => (
                        para.trim() && <p key={i} className="mb-6 opacity-90">{para}</p>
                    ))}
                </div>
                <div className="mt-12 flex justify-center text-stone-600">
                    <Feather size={24} />
                </div>
            </div>
       </div>
    </div>
  );

  // Main Render
  if (selectedStory) {
    return <Reader title={selectedStory.title} content={selectedStory.content} />;
  }

  return (
    <div className="pb-24 pt-4 h-[calc(100vh-80px)] overflow-hidden flex flex-col">
      <header className="mb-6 shrink-0">
        <h1 className="text-3xl font-serif text-stone-100 mb-2">Sleep Stories</h1>
        <p className="text-stone-500 text-sm">Hypnotic narratives designed to lower cortisol.</p>
      </header>

      <div className="flex-1 overflow-y-auto pr-1 pb-4 scrollbar-thin scrollbar-thumb-stone-800">
          <div className="grid grid-cols-1 gap-4">
              {PREMADE_STORIES.map((story) => (
              <button
                  key={story.id}
                  onClick={() => setSelectedStory(story)}
                  className="group relative overflow-hidden p-6 rounded-2xl border border-stone-800 bg-stone-900/40 text-left transition-all hover:bg-stone-900 hover:border-orange-900/30 active:scale-[0.99]"
              >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <BookOpen size={20} className="text-orange-400" />
                  </div>
                  <div className="relative z-10">
                      <h3 className="font-serif text-xl text-stone-200 mb-2 group-hover:text-orange-100 transition-colors">{story.title}</h3>
                      <p className="text-sm text-stone-500 mb-4 line-clamp-2 leading-relaxed">{story.description}</p>
                      <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 text-xs text-stone-600 font-medium bg-stone-950/50 px-2 py-1 rounded-md">
                              <Clock size={12} /> {story.duration}
                          </span>
                          <div className="flex gap-2">
                              {story.tags.map(tag => (
                                  <span key={tag} className="text-[10px] text-stone-500 border border-stone-800 px-2 py-0.5 rounded-full">
                                      {tag}
                                  </span>
                              ))}
                          </div>
                      </div>
                  </div>
              </button>
              ))}
          </div>
      </div>
    </div>
  );
};

export default StoryMode;