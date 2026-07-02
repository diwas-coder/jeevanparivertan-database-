import { useState } from 'react';
import {
  ShieldCheck,
  Users,
  BrainCircuit,
  ShieldAlert,
  Phone,
  Sparkles,
  ArrowRight,
  HeartPulse,
  MapPin,
  MessageCircle,
  Navigation,
  ExternalLink,
  Compass,
  CheckCircle2,
  Calendar,
  Activity,
  Award,
  Copy,
  Clock,
  Check
} from 'lucide-react';
import { Screen } from '../types';

// Professional, high-resolution clinical photographs representing Jeevan Parivartan Nasha Mukti Kendra
const imgDoctor = "/image/image01.jpeg";
const imgWard = "/image/image02.jpeg";
const imgAquarium = "/image/image03.jpeg";
const imgGroup = "/image/image04.jpeg";

interface HomeViewProps {
  onNavigate: (screen: Screen) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  const addressQuery = "Jeevan parivartan Nasha Mukti kendra, GGI Rd, nearby Vidhaya Hospital, Harikanshgadi, Mohanlalganj, Uttar Pradesh 226301";
  const mapDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressQuery)}`;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(addressQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const whatsappUrl = "https://wa.me/918052948863?text=Hello%20Jeevan%20Parivartan%20Kendra,%20I%20want%20to%20inquire%20about%20your%20rehabilitation%20services.";
  const callUrl = "tel:+918052948863";

  // State for the interactive slide explorer in the Hero section
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // States for the interactive reorganized map/location section
  const [mapTab, setMapTab] = useState<'address' | 'travel'>('address');
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(addressQuery);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  // Array of 4 user-provided real photos of the center
  const realPhotos = [
    {
      id: 'doctor',
      img: imgDoctor,
      title: "Director Dr. Jyoti Pal",
      description: "Dr. Jyoti Pal (Director) offering dedicated psychiatric consultations, expert mental health diagnosis, and clinical guidance at her workspace.",
      badge: "Director's Desk",
      tag: "Expert Psychiatry"
    },
    {
      id: 'ward',
      img: imgWard,
      title: "Comfortable Lodging Ward",
      description: "Hygienic accommodation wards fitted with custom medical beds and vibrant green grass walls designed to lower stress levels and foster relaxation.",
      badge: "Premium Accommodation",
      tag: "Safe Environment"
    },
    {
      id: 'aquarium',
      img: imgAquarium,
      title: "Warm Entrance & Reception",
      description: "Our welcoming lobby features a serene fish aquarium and a visible 'NO DRUGS - SAVE LIFE, LOVE LIFE' declaration to boost positive psychological resolve.",
      badge: "Lobby & Reception",
      tag: "Serene Lobby"
    },
    {
      id: 'group',
      img: imgGroup,
      title: "Rehabilitation Group Class",
      description: "Interactive therapeutic sessions where patients gather to study coping mechanisms, participate in daily group support, and join motivation lectures.",
      badge: "Group Therapy Room",
      tag: "Therapeutic Community"
    }
  ];

  return (
    <div className="bg-stone-50 min-h-screen font-sans">

      {/* 1. HERO SECTION WITH SPLIT COLUMN & INTERACTIVE PHOTO SLIDESHOW */}
      <section className="relative min-h-[660px] flex items-center justify-center py-16 px-6 md:px-12 bg-gradient-to-b from-teal-50/90 via-teal-100/20 to-stone-50 overflow-hidden border-b border-teal-100/30">
        {/* Subtle decorative background spheres */}
        <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-teal-200/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-emerald-200/15 blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column: Premium Text & Call to Actions */}
            <div className="lg:col-span-7 text-left space-y-6">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-teal-100/90 text-teal-950 text-xs font-bold uppercase tracking-wider shadow-sm border border-teal-200">
                <Sparkles className="w-3.5 h-3.5 text-teal-700 animate-pulse" />
                Lucknow's Highly Trusted De-addiction Center
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-slate-900 tracking-tight leading-none">
                Real Healing. <br />
                <span className="text-teal-700 bg-clip-text">Authentic Recovery.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal">
                Welcome to <strong>Jeevan Parivartan Nasha Mukti Kendra</strong>. We provide premium, certified clinical de-addiction pathways for alcohol, drug, tobacco, and gutkha dependencies under the expert guidance of <strong>Dr. Jyoti Pal (Director)</strong>.
              </p>

              {/* Real Facility Highlight Note */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl max-w-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-emerald-800 font-medium">
                  <strong>100% Genuine & Transparent:</strong> Look at our actual center photos! We are dedicated to providing a safe, clean, and family-supported treatment journey.
                </p>
              </div>

              {/* Core Call to Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a
                  href={callUrl}
                  className="w-full sm:w-auto bg-teal-700 text-white px-7 py-4 rounded-xl font-bold shadow-lg shadow-teal-100/50 flex items-center justify-center gap-2 hover:bg-teal-800 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
                >
                  <Phone className="w-4.5 h-4.5" />
                  Call Hotline: +91 8052948863
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-4 rounded-xl font-bold shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
                >
                  <MessageCircle className="w-4.5 h-4.5 fill-white" />
                  WhatsApp Support
                </a>
              </div>

              {/* ISO Badge */}
              <div className="flex flex-wrap gap-4 items-center text-slate-400 text-xs font-semibold uppercase tracking-wider pt-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  100% Secure &amp; Private
                </span>
              </div>
            </div>

            {/* Right Column: Beautiful Interactive Slideshow of Real Photos */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 p-3 shadow-xl">

                {/* Active Image Canvas */}
                <div className="relative h-[280px] sm:h-[320px] rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={realPhotos[activePhotoIndex].img}
                    alt={realPhotos[activePhotoIndex].title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                  />
                  {/* Floating tag overlay */}
                  <span className="absolute top-3 left-3 bg-teal-900/90 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                    {realPhotos[activePhotoIndex].tag}
                  </span>
                </div>

                {/* Info Display below current image */}
                <div className="p-4 space-y-1">
                  <h3 className="text-lg font-display font-extrabold text-slate-900">
                    {realPhotos[activePhotoIndex].title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {realPhotos[activePhotoIndex].description}
                  </p>
                </div>
              </div>

              {/* Interactive Thumbnail Switchers */}
              <div className="grid grid-cols-4 gap-2">
                {realPhotos.map((photo, idx) => (
                  <button
                    key={photo.id}
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`relative rounded-xl overflow-hidden h-16 border-2 transition-all cursor-pointer ${activePhotoIndex === idx
                        ? 'border-teal-700 ring-2 ring-teal-100 scale-95'
                        : 'border-slate-200 hover:border-teal-300'
                      }`}
                  >
                    <img
                      src={photo.img}
                      alt={photo.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-slate-950/20 transition-opacity ${activePhotoIndex === idx ? 'opacity-0' : 'hover:opacity-0'
                      }`} />
                  </button>
                ))}
              </div>
              <p className="text-center text-[11px] text-slate-400 font-semibold tracking-wide uppercase">
                &larr; Click thumbnails to view our center facilities &rarr;
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. TRUST CARDS (BENTO STYLE) */}
      <section className="py-20 bg-stone-50 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <div className="text-center mb-16">
            <span className="text-teal-700 text-xs font-bold uppercase tracking-widest block mb-2">Our Standards</span>
            <h2 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">
              Why Families Trust Jeevan Parivartan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="bg-teal-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-teal-700">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-slate-900 mb-3">Confidential Support</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Your recovery journey is completely secure under strict clinical non-disclosure and privacy protocols.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-emerald-600">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-slate-900 mb-3">Family Counseling</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                We support families alongside patients, healing relationships and preparing safe environments.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="bg-amber-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-amber-600">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-slate-900 mb-3">Expert Psychiatrists</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Senior clinical experts address primary mental trauma to treat addiction roots, not just symptoms.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="bg-red-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-red-600">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-slate-900 mb-3">Safe Infrastructure</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                A completely secure, 24/7 medically staffed facility guaranteeing peaceful, restorative detoxification.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. GEOLOCATION, MAP, & DIRECT HELPLINES SECTION */}
      <section className="py-24 bg-gradient-to-b from-stone-50 to-white border-t border-slate-100 relative overflow-hidden">
        {/* Abstract decorative accent */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-teal-50/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-stone-100/60 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

          {/* Section Header */}
          <div className="max-w-3xl mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-[11px] font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Center Intake Active • admissions open</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tight leading-tight">
              Locate Our Nasha Mukti Kendra Lucknow
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
              Our state-of-the-art rehabilitation facility is situated in Mohanlalganj, Lucknow. It is fully sanitized, tranquil, and perfectly connected for rapid transport and confidential emergency family pickups.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-stretch">

            {/* Left Column: Interactive Tabbed Panel & Helplines */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">

              <div className="space-y-6">
                {/* Modern Custom Tabs */}
                <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50">
                  <button
                    onClick={() => setMapTab('address')}
                    className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer focus:outline-none flex items-center justify-center gap-2 ${mapTab === 'address'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    <MapPin className={`w-4 h-4 ${mapTab === 'address' ? 'text-teal-700' : 'text-slate-400'}`} />
                    <span>Exact Address</span>
                  </button>
                  <button
                    onClick={() => setMapTab('travel')}
                    className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer focus:outline-none flex items-center justify-center gap-2 ${mapTab === 'travel'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    <Compass className={`w-4 h-4 ${mapTab === 'travel' ? 'text-teal-700' : 'text-slate-400'}`} />
                    <span>How To Reach us</span>
                  </button>
                </div>

                {/* Tab Content Panels */}
                <div className="min-h-[220px]">
                  {mapTab === 'address' ? (
                    <div className="space-y-5 animate-in fade-in duration-300">
                      <div className="p-6 rounded-2xl bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition-all space-y-4">
                        <div className="space-y-3">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md inline-block">
                            Our Landmark Center
                          </span>
                          <h3 className="text-lg font-display font-extrabold text-slate-900">
                            Jeevan Parivartan Kendra
                          </h3>
                          <p className="text-sm text-slate-600 leading-relaxed font-medium">
                            GGI Rd, nearby Vidhaya Hospital, Harikanshgadi, Mohanlalganj, Lucknow, Uttar Pradesh 226301
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span>Visits: 9:00 AM - 7:00 PM</span>
                          </div>

                          <button
                            onClick={handleCopyAddress}
                            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                          >
                            {copiedAddress ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Address</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <a
                          href={mapDirectionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <Navigation className="w-3.5 h-3.5 fill-white" />
                          Get Directions
                        </a>
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <MessageCircle className="w-4.5 h-4.5 fill-white" />
                          WhatsApp Us
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-white border border-slate-200/60 shadow-sm space-y-4 animate-in fade-in duration-300">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Convenient Travel Guide</h4>

                      <div className="space-y-3.5 text-slate-700 text-xs sm:text-sm">
                        <div className="flex gap-3">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[10px] flex-shrink-0 mt-0.5">
                            🚆
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">Charbagh Railway Station</p>
                            <p className="text-slate-500 text-xs mt-0.5">~22 km away. Direct taxi/auto routes via Raebareli Road in under 40 minutes.</p>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-3 border-t border-slate-100">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[10px] flex-shrink-0 mt-0.5">
                            ✈️
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">CCS International Airport</p>
                            <p className="text-slate-500 text-xs mt-0.5">~24 km away. Highly convenient outer ring road bypass access avoids heavy city traffic.</p>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-3 border-t border-slate-100">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[10px] flex-shrink-0 mt-0.5">
                            📍
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">Prominent Landmark Hint</p>
                            <p className="text-slate-500 text-xs mt-0.5">Located on GGI Road, just adjacent to the well-known Vidhaya Hospital in Mohanlalganj.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Help & Pickups Action Widget */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-900 to-slate-900 text-white shadow-xl space-y-4 border border-teal-850 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-800/10 rounded-full blur-2xl" />

                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-950/60 px-2.5 py-1 rounded-md inline-block">
                      Available 24 Hours
                    </span>
                    <h4 className="text-lg font-display font-black mt-2 text-white">Emergency Help &amp; Pickups</h4>
                  </div>
                  <div className="bg-white/10 w-10 h-10 rounded-xl flex items-center justify-center text-emerald-400">
                    <HeartPulse className="w-5 h-5 animate-pulse" />
                  </div>
                </div>

                <p className="text-xs text-teal-100 leading-relaxed relative z-10">
                  Call our clinical helpdesk to coordinate urgent medical transfers, confidential admission pickups, or talk with an on-duty medical counselor immediately.
                </p>

                <div className="pt-2 relative z-10">
                  <a
                    href={callUrl}
                    className="inline-flex w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm py-3.5 px-4 rounded-xl items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Phone className="w-4 h-4 fill-slate-950" />
                    <span>Call Helpline: +91 8052948863</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Right Column: Premium Map Interface & Highlights */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">

              {/* Map Holder Card */}
              <div className="flex-1 min-h-[380px] rounded-3xl overflow-hidden shadow-md border border-slate-200/80 relative bg-slate-100 group">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Jeevan Parivartan Nasha Mukti Kendra Lucknow Location Map"
                  className="absolute inset-0 w-full h-full"
                />

                {/* Floating Directions Action Panel */}
                <div className="absolute bottom-5 left-5 z-10 right-5 sm:right-auto">
                  <a
                    href={mapDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/95 backdrop-blur-md text-slate-900 font-extrabold text-xs px-4 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 border border-slate-200/50 hover:bg-white hover:scale-105 transition-all w-full sm:w-auto"
                  >
                    <Compass className="w-4 h-4 text-teal-700 animate-spin" style={{ animationDuration: '6s' }} />
                    <span>Open in Google Maps App</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 ml-1" />
                  </a>
                </div>
              </div>

              {/* Location Trust Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-slate-200/60 flex items-center gap-3">
                  <span className="text-lg">🚑</span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 leading-none">Emergency Pickup</h5>
                    <p className="text-[10px] text-slate-500 mt-1">24/7 Response</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-slate-200/60 flex items-center gap-3">
                  <span className="text-lg">🔒</span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 leading-none">Confidential Entry</h5>
                    <p className="text-[10px] text-slate-500 mt-1">Strict Privacy</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-slate-200/60 flex items-center gap-3">
                  <span className="text-lg">🚗</span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 leading-none">Private Parking</h5>
                    <p className="text-[10px] text-slate-500 mt-1">Safe &amp; Secure</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-slate-200/60 flex items-center gap-3">
                  <span className="text-lg">📹</span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 leading-none">CCTV Monitored</h5>
                    <p className="text-[10px] text-slate-500 mt-1">24/7 Security</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. EXPLORE SECTION / REDIRECT CARDS */}
      <section className="py-20 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest block mb-3">Begin Your Recovery</span>
            <h2 className="text-3xl font-display font-extrabold text-white mb-4">Dedicated Portals for Every Step</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Explore our specialized sections to learn more about our team, treatment timeline, and clinical methodology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Services Page Link */}
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-800 flex flex-col justify-between hover:border-teal-500/50 transition-all group">
              <div>
                <span className="text-teal-400 text-xs font-bold uppercase tracking-wider block mb-2">01. Programs</span>
                <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-teal-400 transition-colors">Our Services</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Learn about our multi-disciplinary medical detox pathways for Alcohol, Drugs, Cannabis, Tobacco, and 24/7 Home Pickup.
                </p>
              </div>
              <button
                onClick={() => onNavigate('SERVICES')}
                className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1.5 transition-all cursor-pointer bg-transparent border-none text-left"
              >
                Explore Services <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* About Page Link */}
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-800 flex flex-col justify-between hover:border-teal-500/50 transition-all group">
              <div>
                <span className="text-teal-400 text-xs font-bold uppercase tracking-wider block mb-2">02. Philosophy</span>
                <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-teal-400 transition-colors">About Our Kendra</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Read our history, core philosophy, and learn about our team of senior clinical psychiatrists and medical counselors in Lucknow.
                </p>
              </div>
              <button
                onClick={() => onNavigate('ABOUT')}
                className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1.5 transition-all cursor-pointer bg-transparent border-none text-left"
              >
                Learn About Us <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Contact Page Link */}
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-800 flex flex-col justify-between hover:border-teal-500/50 transition-all group">
              <div>
                <span className="text-teal-400 text-xs font-bold uppercase tracking-wider block mb-2">03. Support</span>
                <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-teal-400 transition-colors">Get In Touch</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Talk to a support worker, find our address coordinates in Lucknow, or submit a request for a confidential callback.
                </p>
              </div>
              <button
                onClick={() => onNavigate('CONTACT')}
                className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1.5 transition-all cursor-pointer bg-transparent border-none text-left"
              >
                View Contact Info <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
