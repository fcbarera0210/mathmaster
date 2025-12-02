import React from 'react';
import { LevelConfig } from './types';
import { Fraction } from './components/Fraction';

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: "Fundamentos Básicos",
    description: "Aprende qué sucede cuando elevas una fracción a un exponente positivo.",
    theory: [
      "Una potencia de base racional es simplemente una fracción elevada a un número.",
      "Para resolverla, debes elevar tanto el numerador (arriba) como el denominador (abajo) al mismo exponente.",
      "La regla es: (a/b)ⁿ = aⁿ / bⁿ"
    ],
    example: "Ejemplo: (2/3)² = 2²/3² = 4/9",
    requiredScore: 5,
    color: "bg-blue-500"
  },
  {
    id: 2,
    title: "El Mundo Invertido",
    description: "Descubre el poder de los exponentes negativos.",
    theory: [
      "Cuando el exponente es un número entero negativo, ¡la fracción se invierte!",
      "El numerador pasa a ser denominador y viceversa. Luego, el exponente se vuelve positivo.",
      "La regla es: (a/b)⁻ⁿ = (b/a)ⁿ = bⁿ / aⁿ"
    ],
    example: "Ejemplo: (2/3)⁻² = (3/2)² = 9/4",
    requiredScore: 5,
    color: "bg-purple-500"
  },
  {
    id: 3,
    title: "Producto de Potencias",
    description: "Multiplicación de potencias con la misma base racional.",
    theory: [
      "Si multiplicas dos potencias que tienen la misma base (la misma fracción), mantienes la base y SUMAS los exponentes.",
      "La regla es: (a/b)ⁿ · (a/b)ᵐ = (a/b)ⁿ⁺ᵐ"
    ],
    example: "Ejemplo: (1/2)² · (1/2)³ = (1/2)⁵",
    requiredScore: 5,
    color: "bg-emerald-500"
  },
  {
    id: 4,
    title: "Potencia de una Potencia",
    description: "Elevando una potencia a otro exponente.",
    theory: [
      "Si tienes una potencia elevada a otro exponente, mantienes la base y MULTIPLICAS los exponentes.",
      "La regla es: ((a/b)ⁿ)ᵐ = (a/b)ⁿᵐ"
    ],
    example: "Ejemplo: ((2/3)²)³ = (2/3)⁶",
    requiredScore: 5,
    color: "bg-orange-500"
  }
];
