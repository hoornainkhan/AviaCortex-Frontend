import { cn } from './ui/utils';

interface HealthScoreBarProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function HealthScoreBar({ score, size = 'md', showLabel = true }: HealthScoreBarProps) {
  const getHealthColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getHealthText = (score: number) => {
    if (score >= 80) return 'Good';
    if (score >= 60) return 'Caution';
    return 'Critical';
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn('flex-1 bg-muted rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={cn(
            'h-full transition-all duration-300 rounded-full',
            getHealthColor(score)
          )}
          style={{ width: `${score}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex items-center gap-2 min-w-fit">
          <span className="text-sm font-medium">{score}%</span>
          <span className={cn(
            'text-xs px-2 py-1 rounded-full',
            score >= 80 && 'bg-green-500/10 text-green-500',
            score >= 60 && score < 80 && 'bg-amber-500/10 text-amber-500',
            score < 60 && 'bg-red-500/10 text-red-500'
          )}>
            {getHealthText(score)}
          </span>
        </div>
      )}
    </div>
  );
}