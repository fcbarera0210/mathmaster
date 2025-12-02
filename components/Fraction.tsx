import React from 'react';

interface FractionProps {
  n: React.ReactNode; // Numerator
  d: React.ReactNode; // Denominator
  exp?: React.ReactNode; // Exponent for the whole fraction
  negative?: boolean;
}

export const Fraction: React.FC<FractionProps> = ({ n, d, exp, negative }) => {
  return (
    <div className="inline-flex items-center mx-1 font-serif text-xl sm:text-2xl">
      {negative && <span className="mr-1">-</span>}
      {exp && <span className="text-3xl sm:text-4xl text-gray-600 font-light mx-0.5">(</span>}
      <div className="math-fraction">
        <span className="math-fraction-top">{n}</span>
        <span className="math-fraction-bottom">{d}</span>
      </div>
      {exp && (
        <>
          <span className="text-3xl sm:text-4xl text-gray-600 font-light mx-0.5">)</span>
          <sup className="text-lg sm:text-xl font-bold -top-4 relative">{exp}</sup>
        </>
      )}
    </div>
  );
};

interface SimplePowerProps {
  base: React.ReactNode;
  exp: React.ReactNode;
}

export const SimplePower: React.FC<SimplePowerProps> = ({ base, exp }) => {
    return (
        <span className="inline-flex items-center">
            {base}
            <sup className="text-lg font-bold">{exp}</sup>
        </span>
    )
}
