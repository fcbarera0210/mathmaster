import React from 'react';
import { LevelConfig } from '../types';
import { Lock, Unlock, Star, Play } from 'lucide-react';

interface LevelCardProps {
  level: LevelConfig;
  isUnlocked: boolean;
  completed: boolean;
  onSelect: (level: LevelConfig) => void;
}

export const LevelCard: React.FC<LevelCardProps> = ({ level, isUnlocked, completed, onSelect }) => {
  return (
    <div 
      onClick={() => isUnlocked && onSelect(level)}
      className={`
        relative overflow-hidden rounded-3xl p-6 transition-all duration-300 border-b-4
        ${isUnlocked 
          ? 'cursor-pointer transform hover:-translate-y-1 hover:shadow-xl bg-white border-gray-200' 
          : 'opacity-70 grayscale bg-gray-100 border-gray-200 cursor-not-allowed'}
      `}
    >
      <div className={`absolute top-0 right-0 p-4 opacity-10`}>
        <span className="text-9xl font-black">{level.id}</span>
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white ${level.color}`}>
               Nivel {level.id}
             </span>
             {completed && <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />}
             {!isUnlocked && <Lock className="w-5 h-5 text-gray-400" />}
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-2 font-display">{level.title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-4">{level.description}</p>
        </div>

        <div className="mt-4">
            {isUnlocked ? (
                <div className="flex items-center text-indigo-600 font-bold group">
                    Jugar ahora 
                    <Play className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform fill-current" />
                </div>
            ) : (
                <div className="flex items-center text-gray-400 font-medium">
                    Bloqueado
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
