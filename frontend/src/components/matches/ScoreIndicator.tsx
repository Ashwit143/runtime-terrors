import React from 'react';

interface ScoreIndicatorProps {
  score: number;
  showTag?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreIndicator: React.FC<ScoreIndicatorProps> = ({
  score,
  showTag = true,
  size = 'md',
}) => {
  const isHigh = score >= 70;
  const isModerate = score >= 40 && score < 70;
  const statusClass = isHigh ? 'high' : isModerate ? 'moderate' : 'low';
  const tagText = isHigh ? 'High Match' : isModerate ? 'Moderate' : 'Low Match';

  const sizeStyle =
    size === 'sm'
      ? { width: '60px', height: '60px', minWidth: '60px' }
      : size === 'lg'
      ? { width: '96px', height: '96px', minWidth: '96px' }
      : { width: '80px', height: '80px', minWidth: '80px' };

  const numStyle =
    size === 'sm'
      ? { fontSize: '20px' }
      : size === 'lg'
      ? { fontSize: '32px' }
      : { fontSize: '26px' };

  return (
    <div className={`score-module ${statusClass}`} style={sizeStyle} title={`Match Score: ${score}/100`}>
      <div className="score-number" style={numStyle}>
        {score.toFixed(0)}
      </div>
      {showTag && <div className="score-tag">{tagText}</div>}
    </div>
  );
};
