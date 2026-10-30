import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Tv,
  Sparkles,
  MapPin,
  Camera,
} from 'lucide-react';
import { HERO_SLIDES } from '../../data/mockData';
import { useLanguage } from '../../hooks/useLanguage';

export const HeroSlideshow: React.FC = () => {
  const { isTe } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // Slideshow automatic transition
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section
      className="relative w-full h-[620px] sm:h-[680px] lg:h-[720px] overflow-hidden bg-godavari-blue-950 text-white select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Godavari Pushkaralu Hero Slideshow"
    >
      {/* Background Slides with Authentic Godavari Festival Photos */}
      {HERO_SLIDES.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <img
            src={item.imageUrl}
            alt={item.titleEn}
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
          />
          {/* Subtle cinematic gradient so text is readable while full photo vibrancy shines */}
          <div className="absolute inset-0 bg-gradient-to-t from-godavari-blue-950 via-godavari-blue-950/65 to-black/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-godavari-blue-950/90 via-godavari-blue-950/50 to-transparent" />
        </div>
      ))}

      {/* Hero Content Container (Uncluttered, No Notification Banner) */}
      <div className="relative z-20 container mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-8 sm:pt-10">
        <div className="max-w-3xl">
          {/* Location & Govt Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-godavari-turquoise-500/25 backdrop-blur-md border border-godavari-turquoise-400/40 text-godavari-turquoise-300 text-xs sm:text-sm font-semibold mb-4 sm:mb-5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-telugu">{isTe ? slide.tagTe : slide.tagEn}</span>
            <span className="text-godavari-turquoise-400/60">•</span>
            <span className="flex items-center gap-1 text-slate-200 font-telugu">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {isTe ? slide.locationTe : slide.locationEn}
            </span>
          </div>

          {/* Main Festival Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-lg mb-3 font-telugu leading-tight">
            {isTe ? slide.titleTe : slide.titleEn}
          </h1>

          {/* Subheading */}
          <div className="text-lg sm:text-2xl font-bold text-amber-300/95 tracking-wide mb-4 font-telugu">
            {isTe
              ? 'ఆంధ్రప్రదేశ్ ప్రభుత్వం • ద్వాదశ పుష్కర మహోత్సవం 2027'
              : 'Govt. of Andhra Pradesh • Maha Pushkara Mahotsavam 2027'}
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed max-w-2xl mb-8 font-normal drop-shadow font-telugu">
            {isTe ? slide.subtitleTe : slide.subtitleEn}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-godavari-turquoise-500 to-godavari-blue-600 hover:from-godavari-turquoise-600 hover:to-godavari-blue-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-godavari-turquoise-900/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-godavari-turquoise-400 font-telugu"
            >
              <Compass className="w-5 h-5 text-amber-300" />
              <span>{isTe ? 'ఘాట్‌లను అన్వేషించండి' : 'Explore Ghats & Navigation'}</span>
            </Link>

            <Link
              to="/live"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/25 backdrop-blur-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white/50 font-telugu"
            >
              <Tv className="w-5 h-5 text-rose-400 animate-pulse" />
              <span>{isTe ? 'ప్రత్యక్ష ప్రసారాలు (Live)' : 'Live Pushkaralu Streams'}</span>
            </Link>
          </div>
        </div>

        {/* Archival Rajahmundry Photo Caption Badge & Slide Index */}
        <div className="absolute bottom-6 right-6 hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-xs text-slate-200">
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-telugu">{isTe ? slide.captionTe : slide.captionEn}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono font-bold text-amber-300">
            {String(currentSlide + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-godavari-blue-950/60 hover:bg-godavari-blue-900/90 text-white/80 hover:text-white border border-white/15 backdrop-blur-md transition-all focus:outline-none"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-godavari-blue-950/60 hover:bg-godavari-blue-900/90 text-white/80 hover:text-white border border-white/15 backdrop-blur-md transition-all focus:outline-none"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all rounded-full ${
              index === currentSlide
                ? 'w-8 h-2.5 bg-godavari-turquoise-400 shadow-sm'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
