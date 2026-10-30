import React, { useState, useEffect } from 'react';
import { Bell, BellRing, Check } from 'lucide-react';
import { phase4Api } from '../../services/phase4Api';
import { useLanguage } from '../../hooks/useLanguage';

interface ReminderButtonProps {
  streamId: string;
  streamTitleTe: string;
  streamTitleEn: string;
  scheduledStart: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const ReminderButton: React.FC<ReminderButtonProps> = ({
  streamId,
  streamTitleTe,
  streamTitleEn,
  scheduledStart,
  className = '',
  size = 'sm',
}) => {
  const { isTe } = useLanguage();
  const [isSet, setIsSet] = useState(false);
  const [justToggled, setJustToggled] = useState(false);

  useEffect(() => {
    setIsSet(phase4Api.isReminderSet(streamId));
  }, [streamId]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const nextState = phase4Api.toggleReminder(
      streamId,
      streamTitleTe,
      streamTitleEn,
      scheduledStart
    );
    setIsSet(nextState);
    setJustToggled(true);
    setTimeout(() => setJustToggled(false), 2000);
  };

  const sizeClasses =
    size === 'sm' ? 'px-2.5 py-1 text-xs gap-1.5' : 'px-4 py-2 text-sm gap-2';

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center justify-center font-semibold rounded-xl transition-all shadow-xs active:scale-95 ${sizeClasses} ${
        isSet
          ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold'
          : 'bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
      } ${className}`}
      title={isSet ? (isTe ? 'జ్ఞాపిక సెట్ చేయబడింది' : 'Reminder is Set') : isTe ? 'జ్ఞాపిక సెట్ చేయండి' : 'Set Reminder'}
    >
      {justToggled ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-800" />
          <span>{isTe ? 'సేవ్ అయింది!' : 'Saved!'}</span>
        </>
      ) : isSet ? (
        <>
          <BellRing className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
          <span>{isTe ? 'జ్ఞాపిక ఆన్' : 'Reminder On'}</span>
        </>
      ) : (
        <>
          <Bell className="w-3.5 h-3.5 text-slate-600" />
          <span>{isTe ? 'జ్ఞాపిక' : 'Remind Me'}</span>
        </>
      )}
    </button>
  );
};
