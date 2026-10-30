import React, { useMemo } from 'react';
import '../../styles/components/WaveformBars.css';

interface WaveformBarsProps {
  animated: boolean;
  barCount?: number;
}

export const WaveformBars: React.FC<WaveformBarsProps> = ({ animated, barCount = 45 }) => {
  // Generate stable random initial heights and delays for the bars
  const bars = useMemo(() => {
    return Array.from({ length: barCount }).map((_, i) => {
      // Random height between 10% and 100%
      const baseHeight = Math.random() * 90 + 10;
      // Random animation delay to offset the bouncing
      const delay = Math.random() * -1.5; // Negative delay starts animation midway
      return { baseHeight, delay, id: i };
    });
  }, [barCount]);

  return (
    <div className="waveform-container">
      {bars.map((bar) => (
        <div
          key={bar.id}
          className={`waveform-bar ${animated ? 'animated' : ''}`}
          style={{
            height: animated ? '100%' : `${bar.baseHeight}%`,
            animationDelay: `${bar.delay}s`,
          }}
        />
      ))}
    </div>
  );
};
