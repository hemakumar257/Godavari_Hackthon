import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { PREVIEW_EVENTS } from '../../data/mockData';
import { useLanguage } from '../../hooks/useLanguage';
import { SectionHeading } from '../common/SectionHeading';
import { Badge } from '../common/Badge';

export const UpcomingEventsPreview: React.FC = () => {
  const { isTe } = useLanguage();

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          titleTe="రాబోయే ప్రధాన కార్యక్రమాలు & పూజలు"
          titleEn="Upcoming Major Ceremonies & Pujas"
          subtitleTe="నమూనా కార్యక్రమాల షెడ్యూల్ (అధికారిక పుష్కర తేదీలు ప్రభుత్వం త్వరలో ప్రకటించనుంది)"
          subtitleEn="Sample preview schedule. Official Pushkaralu dates will be declared by the government"
          actionText={isTe ? 'అన్ని కార్యక్రమాలు చూడండి' : 'View Full Schedule'}
          actionHref="/events"
          isTe={isTe}
        />

        {/* Demo Disclaimer notice */}
        <div className="mb-6 bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 sm:p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-950 font-telugu leading-relaxed">
            <span className="font-bold">
              {isTe ? 'డెమో ప్రదర్శన గమనిక:' : 'Demonstration Content Notice:'}
            </span>{' '}
            {isTe
              ? 'దిగువ చూపిన కార్యక్రమాలు మరియు సమయాలు ప్లాట్‌ఫారమ్ రూపకల్పన పరీక్షకు మాత్రమే. అధికారిక పర్వదినాలు, ముహూర్తాలు దేవదాయ శాఖ ద్వారా ఖరారవుతాయి.'
              : 'The events and timings below are demonstrative placeholders for portal preview. Official ceremonial schedules and mahurat timings will be published upon government release.'}
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PREVIEW_EVENTS.map((event) => (
            <div
              key={event.id}
              className="bg-slate-50/70 rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-elevated transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="turquoise" size="sm">
                    {isTe ? event.categoryTe : event.categoryEn}
                  </Badge>
                  <Badge variant="demo" size="sm">
                    Demo
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-godavari-blue-950 mb-3 group-hover:text-godavari-blue-700 transition font-telugu">
                  {isTe ? event.titleTe : event.titleEn}
                </h3>

                <div className="space-y-2 text-xs sm:text-sm text-slate-600 font-telugu">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-godavari-turquoise-600 shrink-0" />
                    <span>{isTe ? event.dateStrTe : event.dateStrEn}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-godavari-turquoise-600 shrink-0" />
                    <span className="font-medium text-slate-800 font-sans">{event.timeStr}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-godavari-turquoise-600 shrink-0" />
                    <span>{isTe ? event.locationTe : event.locationEn}</span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-3.5 bg-slate-100/80 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold">
                <span className="text-godavari-blue-800 flex items-center gap-1 font-telugu">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  {isTe ? 'కార్యక్రమ వివరాలు' : 'Event Details'}
                </span>
                <Link
                  to="/events"
                  className="text-godavari-blue-700 hover:text-godavari-turquoise-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform font-telugu"
                >
                  {isTe ? 'మరింత చూడండి' : 'Read More'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/events"
            className="inline-flex items-center justify-center w-full px-5 py-3 rounded-xl bg-godavari-blue-900 text-white font-semibold text-sm shadow font-telugu"
          >
            {isTe ? 'అన్ని కార్యక్రమాలు చూడండి' : 'View All Events'}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
