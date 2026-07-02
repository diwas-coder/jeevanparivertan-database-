import { useState } from 'react';
import { GalleryItem } from '../types';
import { Image, Video, Filter, Play, X, Eye, Calendar, Tag, ChevronRight } from 'lucide-react';

interface GalleryViewProps {
  galleryItems: GalleryItem[];
  onNavigate: (screen: any) => void;
}

export default function GalleryView({ galleryItems, onNavigate }: GalleryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<'all' | 'photo' | 'video'>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  // Categories extraction
  const categories = ['All', ...Array.from(new Set(galleryItems.map(item => item.category)))];

  // Filtering logic
  const filteredItems = galleryItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesCategory && matchesType;
  });

  // Helper to render media properly (e.g., YouTube embeds or raw video URLs)
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  return (
    <div id="gallery-view-root" className="bg-stone-50 min-h-screen pb-20">
      {/* Hero Banner Header */}
      <section className="relative py-20 bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(13,148,136,0.08),transparent)]"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-emerald-400/20 inline-block mb-4">
            Center Transparency
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-white mb-6">
            Our Center Gallery
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Explore the authentic gallery of Jeevan Parivartan Nasha Mukti Kendra Lucknow. See our sanitized clinical wards, counseling rooms, therapeutic garden, and healthy daily activities.
          </p>
          
          <div className="flex justify-center gap-3 mt-8">
            <button
              onClick={() => onNavigate('REQUEST_CALL')}
              className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-teal-950/40 cursor-pointer focus:ring-2 focus:ring-teal-400"
            >
              Book Priority Call
            </button>
            <button
              onClick={() => onNavigate('CONTACT')}
              className="bg-transparent hover:bg-white/10 text-white border border-slate-400 text-xs font-bold px-6 py-3 rounded-xl transition-all cursor-pointer focus:ring-2 focus:ring-slate-400"
            >
              Contact Director
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid & Filters */}
      <main className="max-w-7xl mx-auto px-4 md:px-12 mt-12">
        {/* Filters Panel */}
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-[0_4px_20px_rgba(13,148,136,0.02)] border border-slate-100 mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Categories */}
          <div className="w-full md:w-auto">
            <div className="flex items-center gap-2 mb-3 md:mb-0 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <Filter className="w-4 h-4 text-teal-700" />
              <span>Category:</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-teal-900 text-white shadow-md'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Media Type Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200/50 w-full md:w-auto self-stretch md:self-auto justify-around">
            <button
              onClick={() => setSelectedType('all')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedType === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Media
            </button>
            <button
              onClick={() => setSelectedType('photo')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedType === 'photo'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Image className="w-3.5 h-3.5 text-teal-700" />
              Photos
            </button>
            <button
              onClick={() => setSelectedType('video')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedType === 'video'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-teal-700" />
              Videos
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                id={`gallery-card-${item.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:border-teal-200 transition-all duration-300 flex flex-col h-full"
              >
                {/* Media Container */}
                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden cursor-pointer" onClick={() => setActiveItem(item)}>
                  {item.type === 'photo' ? (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      {/* Video Thumbnail styling */}
                      {isYouTubeUrl(item.url) ? (
                        <img
                          src={`https://img.youtube.com/vi/${item.url.split('/embed/')[1]?.split('?')[0] || item.url.split('v=')[1]?.split('&')[0] || 'coN_CunU310'}/0.jpg`}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full bg-teal-950 flex items-center justify-center">
                          <Video className="w-12 h-12 text-teal-400 opacity-60" />
                        </div>
                      )}
                      {/* Play overlay button */}
                      <div className="absolute inset-0 flex items-center justify-center bg-teal-950/20 group-hover:bg-teal-950/40 transition-colors">
                        <div className="w-14 h-14 rounded-full bg-white text-teal-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                          <Play className="w-6 h-6 fill-teal-900 ml-0.5" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hover indicator */}
                  <div className="absolute inset-0 bg-teal-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4 pointer-events-none">
                    <span className="bg-white/95 text-teal-900 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      View Fullscreen
                    </span>
                  </div>

                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-sm text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/15">
                    {item.category}
                  </span>

                  {/* Format Indicator Tag */}
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[9px] font-bold p-1.5 rounded-lg shadow-sm">
                    {item.type === 'photo' ? <Image className="w-3.5 h-3.5 text-teal-700" /> : <Video className="w-3.5 h-3.5 text-teal-700" />}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-display font-bold text-slate-900 line-clamp-1 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <button 
                      onClick={() => setActiveItem(item)}
                      className="text-teal-700 hover:text-teal-950 flex items-center gap-0.5 font-bold uppercase tracking-wider"
                    >
                      Maximize
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <Image className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No media items found</h3>
            <p className="text-slate-400 text-sm mt-1">Please change your filter settings or check back soon.</p>
          </div>
        )}
      </main>

      {/* Safe and Confidential Trust Strip */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mt-20">
        <div className="bg-gradient-to-r from-teal-900 to-emerald-900 text-white p-8 md:p-10 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-8 shadow-md">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-display font-bold tracking-tight mb-2">
              Privacy and Confidences Guaranteed
            </h3>
            <p className="text-xs md:text-sm text-teal-200 leading-relaxed">
              We strictly maintain confidentiality. All faces in our clinical therapy sessions and facility tours are pre-approved or obscured to respect patients' clinical journeys.
            </p>
          </div>
          <button
            onClick={() => onNavigate('CONTACT')}
            className="bg-white text-teal-950 hover:bg-teal-50 text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-md flex-shrink-0 cursor-pointer"
          >
            Inquire Confidential Admission
          </button>
        </div>
      </section>

      {/* FULLSCREEN MODAL (ZOOM / MEDIA PLAYER) */}
      {activeItem && (
        <div className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
          <button
            onClick={() => setActiveItem(null)}
            className="absolute top-6 right-6 w-12 h-12 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Visual Screen Container */}
            <div className="bg-slate-950 aspect-video flex items-center justify-center overflow-hidden relative">
              {activeItem.type === 'photo' ? (
                <img
                  src={activeItem.url}
                  alt={activeItem.title}
                  className="max-w-full max-h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full">
                  {isYouTubeUrl(activeItem.url) ? (
                    <iframe
                      src={`${getEmbedUrl(activeItem.url)}?autoplay=1&rel=0`}
                      title={activeItem.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video
                      src={activeItem.url}
                      className="w-full h-full"
                      controls
                      autoPlay
                    ></video>
                  )}
                </div>
              )}
            </div>

            {/* Modal metadata footer */}
            <div className="p-6 md:p-8 bg-white border-t border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-teal-50 text-teal-800 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-teal-100">
                    {activeItem.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    Published: {new Date(activeItem.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="text-lg font-display font-bold text-slate-900">{activeItem.title}</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl">{activeItem.description}</p>
              </div>
              <button
                onClick={() => {
                  setActiveItem(null);
                  onNavigate('REQUEST_CALL');
                }}
                className="w-full md:w-auto bg-teal-900 hover:bg-teal-950 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer self-stretch md:self-auto text-center"
              >
                Inquire Rehabilitation Care
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
