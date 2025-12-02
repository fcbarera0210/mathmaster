import React from 'react';
import { Question } from '../types';
import { Fraction, SimplePower } from '../components/Fraction';

// Helper to get random int between min and max (inclusive)
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateQuestion = (levelId: number): Question => {
  // Common vars
  let a = randomInt(1, 5);
  let b = randomInt(2, 6);
  while (a === b) b = randomInt(2, 6); // Ensure not 1
  
  // Make sure fraction is simplified-ish (basic check to avoid 2/4, just re-roll or keep small nums)
  if (a % 2 === 0 && b % 2 === 0) { a /= 2; b /= 2; }
  if (a % 3 === 0 && b % 3 === 0) { a /= 3; b /= 3; }

  const n = randomInt(2, 4);
  const m = randomInt(2, 3);

  switch (levelId) {
    case 1: // Basic: (a/b)^n
      {
        const ansNum = Math.pow(a, n);
        const ansDen = Math.pow(b, n);
        
        // Distractors
        const d1Num = Math.pow(a, n);
        const d1Den = b; // Forgot denom
        
        const d2Num = a * n; // Multiplied instead of power
        const d2Den = b * n;

        const d3Num = Math.pow(b, n); // Flipped
        const d3Den = Math.pow(a, n);

        const correctComponent = <Fraction n={ansNum} d={ansDen} />;
        
        const options = [
            correctComponent,
            <Fraction n={d1Num} d={d1Den} />,
            <Fraction n={d2Num} d={d2Den} />,
            <Fraction n={d3Num} d={d3Den} />
        ];

        // Shuffle
        const correctIndex = Math.floor(Math.random() * 4);
        [options[0], options[correctIndex]] = [options[correctIndex], options[0]];

        return {
          id: Math.random().toString(36),
          latexProblem: <div className="flex items-center"><Fraction n={a} d={b} exp={n} /> <span className="mx-2">=</span> <span className="text-3xl">?</span></div>,
          options,
          correctIndex,
          explanation: `Elevamos numerador y denominador: ${a}^${n} = ${ansNum} y ${b}^${n} = ${ansDen}.`
        };
      }

    case 2: // Negative: (a/b)^-n
      {
        const ansNum = Math.pow(b, n); // Flipped
        const ansDen = Math.pow(a, n);
        
        // Distractors
        const d1Num = Math.pow(a, n); // Didn't flip
        const d1Den = Math.pow(b, n);

        const d2Num = Math.pow(b, n); // Flipped but negative sign remains? (Abstract error)
        const d2Den = -Math.pow(a, n);

        const d3Num = b * n;
        const d3Den = a * n;

        const correctComponent = <Fraction n={ansNum} d={ansDen} />;
        const options = [
            correctComponent,
            <Fraction n={d1Num} d={d1Den} />,
            <Fraction n={d2Num} d={d2Den} negative />,
            <Fraction n={d3Num} d={d3Den} />
        ];

        const correctIndex = Math.floor(Math.random() * 4);
        [options[0], options[correctIndex]] = [options[correctIndex], options[0]];

        return {
          id: Math.random().toString(36),
          latexProblem: <div className="flex items-center"><Fraction n={a} d={b} exp={`-${n}`} /> <span className="mx-2">=</span> <span className="text-3xl">?</span></div>,
          options,
          correctIndex,
          explanation: `El exponente negativo invierte la base: (${a}/${b}) se convierte en (${b}/${a}). Luego elevamos a ${n}.`
        };
      }

    case 3: // Product: (a/b)^n * (a/b)^m
      {
        const sumExp = n + m;
        
        // Distractors
        const diffExp = Math.abs(n - m);
        const prodExp = n * m;
        const wrongBaseExp = sumExp; // Maybe displayed differently

        const correctComponent = <Fraction n={a} d={b} exp={sumExp} />;
        const options = [
            correctComponent,
            <Fraction n={a} d={b} exp={prodExp} />, // Multiplied exps
            <Fraction n={a} d={b} exp={diffExp} />, // Subtracted exps
            <Fraction n={a*a} d={b*b} exp={sumExp} /> // Base multiplied
        ];

        const correctIndex = Math.floor(Math.random() * 4);
        [options[0], options[correctIndex]] = [options[correctIndex], options[0]];

        return {
          id: Math.random().toString(36),
          latexProblem: (
            <div className="flex items-center">
              <Fraction n={a} d={b} exp={n} /> 
              <span className="mx-2">·</span> 
              <Fraction n={a} d={b} exp={m} />
            </div>
          ),
          options,
          correctIndex,
          explanation: `Al multiplicar potencias de igual base, sumamos los exponentes: ${n} + ${m} = ${sumExp}.`
        };
      }

    case 4: // Power of Power: ((a/b)^n)^m
      {
        const multExp = n * m;
        
        // Distractors
        const addExp = n + m;
        const powExp = Math.pow(n, m); // Rare but possible confusion
        const divExp = 1;

        const correctComponent = <Fraction n={a} d={b} exp={multExp} />;
        const options = [
            correctComponent,
            <Fraction n={a} d={b} exp={addExp} />, // Added exps
            <Fraction n={b} d={a} exp={multExp} />, // Flipped base
            <Fraction n={a} d={b} exp={powExp} /> // Exponent power
        ];

        const correctIndex = Math.floor(Math.random() * 4);
        [options[0], options[correctIndex]] = [options[correctIndex], options[0]];

        return {
          id: Math.random().toString(36),
          latexProblem: (
              <div className="flex items-center">
                <span className="text-5xl font-light text-gray-700 mx-1">(</span>
                <Fraction n={a} d={b} exp={n} />
                <span className="text-5xl font-light text-gray-700 mx-1">)</span>
                <sup className="text-2xl font-bold -top-6 relative">{m}</sup>
              </div>
          ),
          options,
          correctIndex,
          explanation: `Potencia de una potencia: multiplicamos los exponentes ${n} × ${m} = ${multExp}.`
        };
      }
    
    default:
       return {
          id: "err",
          latexProblem: <span>Error</span>,
          options: [],
          correctIndex: 0,
          explanation: ""
       };
  }
};
