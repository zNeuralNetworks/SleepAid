import React from 'react';
import { Home, Sparkles, BookOpen, Map } from 'lucide-react';
import { AppView } from '../types';
import { motion } from 'framer-motion';

interface NavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { view: AppView.DASHBOARD, icon: Home, label: 'Home' },
    { view: AppView.BREATHE, icon: Sparkles, label: 'Relax' },
    { view: AppView.STORY, icon: BookOpen, label: 'Stories' },
    { view: AppView.ROADMAP, icon: Map, label: 'Roadmap' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-stone-900/90 backdrop-blur-xl border-t border-stone-800 z-50 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className="relative flex flex-col items-center justify-center w-16 h-full cursor-pointer group"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 top-1 bottom-1 bg-stone-800 rounded-xl -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className={`transition-all duration-300 transform ${isActive ? 'scale-110 -translate-y-1' : 'group-hover:scale-105'}`}>
                 <item.icon 
                    size={24} 
                    className={`transition-colors duration-300 ${
                        isActive ? 'text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.4)]' : 'text-stone-500 group-hover:text-stone-300'
                    }`} 
                 />
              </div>
              
              <span className={`text-[10px] mt-1 font-medium transition-colors duration-300 ${isActive ? 'text-orange-200' : 'text-stone-600'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;