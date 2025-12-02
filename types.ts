import React from 'react';

export enum GameState {
  MENU = 'MENU',
  LEARNING = 'LEARNING',
  PLAYING = 'PLAYING',
  LEVEL_COMPLETE = 'LEVEL_COMPLETE',
  GAME_OVER = 'GAME_OVER'
}

export interface LevelConfig {
  id: number;
  title: string;
  description: string;
  theory: string[];
  example: string; // LaTeX-ish or description
  requiredScore: number;
  color: string;
}

export interface Question {
  id: string;
  latexProblem: React.ReactNode; // Visual representation
  options: React.ReactNode[];
  correctIndex: number;
  explanation: string;
}

export interface PlayerStats {
  unlockedLevels: number; // Max level unlocked
  totalScore: number;
  stars: number;
}