import React, { useState } from 'react';
import { X, ZoomIn, MapPin } from 'lucide-react';
import { GalleryItem, HeritageCategory } from '../../types/phase5';
import { useLanguage } from '../../hooks/useLanguage';

interface HeritageGalleryProps {
  items: GalleryItem[];
}

export const HeritageGallery: React.FC<HeritageGalleryProps> = ({ items }) => {
  const { isTe } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<HeritageCategory | 'all'>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const filtered =
    activeCategory === 'all' ? items : items.filter((i) => i.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors font-telugu ${
            activeCategory === 'all'
              ? 'bg-godavari-blue-950 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {isTe ? 'అన్ని ఛాయాచిత్రాలు' : 'All Photos'}
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('river_heritage')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors font-telugu ${
            activeCategory === 'river_heritage'
              ? 'bg-godavari-blue-950 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {isTe ? 'గోదావరి నది' : 'River Godavari'}
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('sacred_ghat')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors font-telugu ${
            activeCategory === 'sacred_ghat'
              ? 'bg-godavari-blue-950 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {isTe ? 'పవిత్ర ఘాట్లు' : 'Sacred Ghats'}
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('ancient_temple')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors font-telugu ${
            activeCategory === 'ancient_temple'
              ? 'bg-godavari-blue-950 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {isTe ? 'పురాతన ఆలయాలు' : 'Temples'}
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('historical_place')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors font-telugu ${
            activeCategory === 'historical_place'
              ? 'bg-godavari-blue-950 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {isTe ? 'చారిత్రక కట్టడాలు' : 'Historical Landmarks'}
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item)}
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 cursor-pointer border border-slate-200 shadow-xs hover:shadow-md"
          >
            <img
              src={item.imageUrl}
              alt={isTe ? item.titleTe : item.titleEn}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

            <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-4 h-4" />
            </div>

            <div className="absolute bottom-2.5 left-3 right-3 text-white">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-300 font-telugu">
                {isTe ? item.categoryLabelTe : item.categoryLabelEn}
              </span>
              <h4 className="font-bold text-sm truncate font-telugu">
                {isTe ? item.titleTe : item.titleEn}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] flex items-center justify-center bg-black">
              <img
                src={selectedImage.imageUrl}
                alt={isTe ? selectedImage.titleTe : selectedImage.titleEn}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs text-godavari-turquoise-400 font-telugu">
                <span>{isTe ? selectedImage.categoryLabelTe : selectedImage.categoryLabelEn}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {selectedImage.locationReference}
                </span>
              </div>
              <h3 className="text-lg font-bold font-telugu">
                {isTe ? selectedImage.titleTe : selectedImage.titleEn}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-telugu">
                {isTe ? selectedImage.captionTe : selectedImage.captionEn}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
