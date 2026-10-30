import React from 'react';
import { Phone, ShieldCheck, HeartPulse, ShieldAlert, LifeBuoy } from 'lucide-react';
import { EmergencyContact } from '../../types/phase3';
import { useLanguage } from '../../hooks/useLanguage';

interface EmergencyContactCardProps {
  contact: EmergencyContact;
  className?: string;
}

export const EmergencyContactCard: React.FC<EmergencyContactCardProps> = ({
  contact,
  className = '',
}) => {
  const { isTe } = useLanguage();

  const getCategoryTheme = (cat: EmergencyContact['category']) => {
    switch (cat) {
      case 'ambulance':
        return {
          bg: 'bg-rose-50 border-rose-200 hover:border-rose-300',
          badge: 'bg-rose-100 text-rose-800',
          btn: 'bg-rose-600 hover:bg-rose-700 text-white',
          icon: <HeartPulse className="w-5 h-5 text-rose-600" />,
        };
      case 'police':
        return {
          bg: 'bg-indigo-50 border-indigo-200 hover:border-indigo-300',
          badge: 'bg-indigo-100 text-indigo-800',
          btn: 'bg-indigo-600 hover:bg-indigo-700 text-white',
          icon: <ShieldAlert className="w-5 h-5 text-indigo-600" />,
        };
      case 'women':
        return {
          bg: 'bg-pink-50 border-pink-200 hover:border-pink-300',
          badge: 'bg-pink-100 text-pink-800',
          btn: 'bg-pink-600 hover:bg-pink-700 text-white',
          icon: <ShieldCheck className="w-5 h-5 text-pink-600" />,
        };
      default:
        return {
          bg: 'bg-amber-50 border-amber-200 hover:border-amber-300',
          badge: 'bg-amber-100 text-amber-800',
          btn: 'bg-amber-600 hover:bg-amber-700 text-white',
          icon: <LifeBuoy className="w-5 h-5 text-amber-600" />,
        };
    }
  };

  const theme = getCategoryTheme(contact.category);

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition-all duration-200 shadow-xs hover:shadow-sm flex flex-col justify-between ${theme.bg} ${className}`}
    >
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white rounded-xl shadow-xs shrink-0">{theme.icon}</div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">
                {isTe ? contact.nameTe : contact.nameEn}
              </h3>
              {contact.isOfficial && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  {isTe ? 'అధికారిక ప్రభుత్వ హెల్ప్‌లైన్' : 'Verified Govt Helpline'}
                </span>
              )}
            </div>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${theme.badge}`}>
            24x7
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {isTe ? contact.descTe : contact.descEn}
        </p>
      </div>

      <div className="pt-4 mt-3 border-t border-slate-200/60 flex items-center justify-between gap-3">
        <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          📞 {contact.number}
        </div>
        <a
          href={`tel:${contact.number}`}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 ${theme.btn}`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>{isTe ? 'ఇప్పుడే కాల్ చేయండి' : 'Call Now'}</span>
        </a>
      </div>
    </div>
  );
};
