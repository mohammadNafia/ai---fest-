import React, { useState, useEffect } from 'react';
import type { Theme } from '@/types';

interface CountdownTimerProps {
  targetDate?: string;
  theme?: Theme;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate: targetDateProp, theme = 'dark' }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(targetDateProp || "April 4, 2026 09:00:00").getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-3 md:gap-4 mt-8 justify-start">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className={`w-14 h-14 md:w-20 md:h-20 backdrop-blur-md rounded-lg flex items-center justify-center ${
            theme === 'light'
              ? 'bg-blue-100/80 border border-blue-300'
              : 'bg-blue-900/20 border border-blue-500/30'
          }`}>
            <span className={`text-xl md:text-3xl font-bold font-mono ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {value < 10 ? `0${value}` : value}
            </span>
          </div>
          <p className={`text-[10px] uppercase tracking-widest mt-2 ${
            theme === 'light' ? 'text-blue-600' : 'text-blue-400'
          }`}>{unit}</p>
        </div>
      ))}
    </div>
  );
};

