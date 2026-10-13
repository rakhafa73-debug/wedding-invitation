import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Calendar, 
  Clock, 
  MapPin, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Share2, 
  Send, 
  UserCheck, 
  Gift, 
  ChevronDown, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { InvitationData, RSVPResponseItem } from '../types/wedding';
import { submitRSVP, getRSVPsForInvitation } from '../services/rsvp';

interface PublicInvitationProps {
  invitation: InvitationData;
  guestNameParam?: string;
  isPreviewMode?: boolean;
  onClosePreview?: () => void;
}

export const PublicInvitation: React.FC<PublicInvitationProps> = ({
  invitation,
  guestNameParam,
  isPreviewMode = false,
  onClosePreview,
}) => {
  // Opening gate
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Guest name detection from URL or prop
  const [guestName, setGuestName] = useState('Tamu Undangan');

  useEffect(() => {
    if (guestNameParam) {
      setGuestName(decodeURIComponent(guestNameParam.replace(/\+/g, ' ')));
    } else if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const toParam = urlParams.get('to');
      if (toParam) {
        setGuestName(decodeURIComponent(toParam.replace(/\+/g, ' ')));
      }
    }
  }, [guestNameParam]);

  // Audio initialization
  useEffect(() => {
    if (invitation.audio_url) {
      const audio = new Audio(invitation.audio_url);
      audio.loop = true;
      audioRef.current = audio;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [invitation.audio_url]);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true);
      }).catch((e) => {
        console.warn('Audio autoplay blocked by browser policy:', e);
      });
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play();
      setIsPlayingMusic(true);
    }
  };

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const targetDate = new Date(invitation.event_date + 'T08:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [invitation.event_date]);

  // RSVPs & Wishes
  const [rsvps, setRsvps] = useState<RSVPResponseItem[]>([]);
  const [formName, setFormName] = useState(guestNameParam || '');
  const [formAttendance, setFormAttendance] = useState<'hadir' | 'tidak' | 'ragu'>('hadir');
  const [formPax, setFormPax] = useState<number>(2);
  const [formMessage, setFormMessage] = useState('');
  const [isSubmittingRSVP, setIsSubmittingRSVP] = useState(false);
  const [rsvpSuccessMessage, setRsvpSuccessMessage] = useState<string | null>(null);
  const [rsvpError, setRsvpError] = useState<string | null>(null);

  // Load existing RSVPs
  useEffect(() => {
    getRSVPsForInvitation(invitation.id).then(setRsvps);
  }, [invitation.id]);

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpError(null);
    setRsvpSuccessMessage(null);
    setIsSubmittingRSVP(true);

    const nameToSubmit = formName.trim() || guestName;
    const res = await submitRSVP(
      invitation.id,
      nameToSubmit,
      formAttendance,
      formAttendance === 'tidak' ? 0 : formPax,
      formMessage
    );

    setIsSubmittingRSVP(false);
    if (res.success && res.data) {
      setRsvps([res.data, ...rsvps]);
      setRsvpSuccessMessage('Terima kasih! Konfirmasi dan doa restu Anda telah berhasil tersimpan.');
      setFormMessage('');
    } else {
      setRsvpError(res.error || 'Gagal mengirim konfirmasi. Silakan coba lagi.');
    }
  };

  // Copy Account Number
  const [copiedBankIdx, setCopiedBankIdx] = useState<number | null>(null);
  const handleCopyAccount = (accNo: string, idx: number) => {
    navigator.clipboard.writeText(accNo);
    setCopiedBankIdx(idx);
    setTimeout(() => setCopiedBankIdx(null), 2500);
  };

  // WhatsApp share
  const [showShareModal, setShowShareModal] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://nuptiawedding.id/i/${invitation.slug}`;
  const whatsappShareText = encodeURIComponent(
    `Kepada Yth. ${guestName}\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri pernikahan kami:\n\n*The Wedding of ${invitation.couple.groom_nickname} & ${invitation.couple.bride_nickname}*\n\nBuka undangan pada tautan berikut:\n${shareUrl}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.`
  );

  return (
    <div className="relative min-h-screen bg-[#2D4038] text-[#2D4038] font-sans selection:bg-[#B6A078]/30">
      {/* Top Banner when in preview mode */}
      {isPreviewMode && (
        <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-2.5 bg-[#202F29] border-b border-[#B6A078]/40 text-xs text-[#F9F6EE]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium tracking-wider uppercase">Live Preview Undangan</span>
          </div>
          {onClosePreview && (
            <button
              onClick={onClosePreview}
              className="px-2.5 py-1 text-xs font-semibold tracking-wide uppercase transition rounded bg-[#B6A078] text-[#2D4038] hover:bg-[#A38C62]"
            >
              Kembali ke Editor
            </button>
          )}
        </div>
      )}

      {/* Floating Audio Toggle */}
      {isOpen && invitation.audio_url && (
        <button
          onClick={toggleMusic}
          aria-label="Toggle Music"
          className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-11 h-11 rounded-full bg-[#2D4038]/90 text-[#B6A078] border border-[#B6A078]/60 shadow-xl backdrop-blur transition-all duration-300 hover:scale-105"
        >
          {isPlayingMusic ? (
            <Volume2 className="w-5 h-5 animate-pulse" />
          ) : (
            <VolumeX className="w-5 h-5 text-[#F9F6EE]/60" />
          )}
        </button>
      )}

      {/* ------------------------------------------------------------- */}
      {/* COVER / GATE MODAL (Buka Undangan) */}
      {/* ------------------------------------------------------------- */}
      {!isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#2D4038] px-6 py-12 text-center text-[#F9F6EE] overflow-y-auto">
          {/* Subtle gold line ornament */}
          <div className="flex flex-col items-center max-w-md w-full pt-4">
            <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#B6A078] mb-3">
              THE WEDDING OF
            </span>

            {/* Arch Photo with thin gold border */}
            <div className="relative my-4 p-1 rounded-t-[140px] rounded-b-2xl border border-[#B6A078]/80 shadow-2xl">
              <div className="w-56 h-76 sm:w-64 sm:h-84 overflow-hidden rounded-t-[136px] rounded-b-xl bg-[#202F29]">
                <img
                  src={invitation.cover_photo || invitation.couple.groom_photo}
                  alt={`${invitation.couple.groom_nickname} & ${invitation.couple.bride_nickname}`}
                  className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
                />
              </div>
            </div>

            {/* Couple Names */}
            <h1 className="font-serif text-3xl sm:text-4xl text-[#F9F6EE] tracking-wide mt-2 font-light">
              {invitation.couple.groom_nickname} <span className="text-[#B6A078] font-serif">&</span> {invitation.couple.bride_nickname}
            </h1>

            {/* Wedding Date in Soft Gold */}
            <p className="mt-2 text-sm tracking-widest text-[#B6A078] uppercase font-light">
              {invitation.akad.date}
            </p>
          </div>

          {/* Guest Greeting Box */}
          <div className="w-full max-w-sm my-6 p-5 rounded-2xl bg-[#202F29]/80 border border-[#B6A078]/30 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-[#F9F6EE]/70 font-light">
              Kepada Yth. Bapak/Ibu/Saudara/i
            </p>
            <h3 className="font-serif text-xl sm:text-2xl text-[#F9F6EE] font-medium mt-1 mb-1">
              {guestName}
            </h3>
            <p className="text-[11px] text-[#F9F6EE]/60 italic">
              *Mohon maaf jika ada kesalahan penulisan nama/gelar
            </p>

            <button
              onClick={handleOpenInvitation}
              className="mt-5 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#B6A078] text-[#2D4038] font-medium text-xs tracking-widest uppercase transition-all duration-300 hover:bg-[#A38C62] hover:shadow-lg hover:shadow-[#B6A078]/20 active:scale-98"
            >
              <Heart className="w-4 h-4 fill-[#2D4038]" />
              Buka Undangan
            </button>
          </div>

          <div className="text-[11px] tracking-widest text-[#B6A078]/60 uppercase font-light">
            Nuptia Wedding Invitation
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MAIN INVITATION VIEW (RESPONSIVE CONTAINER) */}
      {/* ------------------------------------------------------------- */}
      <main className="max-w-xl mx-auto min-h-screen bg-[#F9F6EE] shadow-2xl relative">
        
        {/* ========================================================= */}
        {/* 1. HERO DENGAN LATAR HIJAU GELAP (#2D4038) */}
        {/* ========================================================= */}
        <section className="relative bg-[#2D4038] text-[#F9F6EE] px-6 pt-16 pb-20 text-center overflow-hidden">
          {/* Subtle gold line & corner border */}
          <div className="absolute top-6 left-6 right-6 bottom-6 border border-[#B6A078]/20 pointer-events-none rounded-2xl"></div>

          {/* 2. Label kecil "THE WEDDING OF" */}
          <span className="relative z-10 inline-block text-[11px] font-medium tracking-[0.3em] uppercase text-[#B6A078] mb-4">
            THE WEDDING OF
          </span>

          {/* 3. Foto pasangan dalam bingkai berbentuk arch dengan garis emas tipis */}
          <div className="relative z-10 mx-auto w-52 sm:w-60 my-3 p-1 rounded-t-[140px] rounded-b-2xl border border-[#B6A078] shadow-2xl">
            <div className="w-full h-72 sm:h-80 overflow-hidden rounded-t-[136px] rounded-b-xl bg-[#202F29]">
              <img
                src={invitation.cover_photo}
                alt={`${invitation.couple.groom_name} & ${invitation.couple.bride_name}`}
                className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
              />
            </div>
            {/* Elegant corner gold accents */}
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-[#B6A078]"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-[#B6A078]"></div>
          </div>

          {/* 4. Nama pasangan besar dengan tipografi serif */}
          <h1 className="relative z-10 font-serif text-3xl sm:text-4xl text-[#F9F6EE] tracking-wide mt-6 font-normal">
            {invitation.couple.groom_nickname} <span className="text-[#B6A078] font-serif italic">&</span> {invitation.couple.bride_nickname}
          </h1>

          {/* 5. Tanggal pernikahan berwarna emas */}
          <p className="relative z-10 mt-3 text-xs sm:text-sm tracking-[0.25em] text-[#B6A078] uppercase font-light">
            {invitation.akad.date}
          </p>

          {/* Countdown Timer */}
          <div className="relative z-10 mt-8 grid grid-cols-4 gap-2 max-w-xs mx-auto">
            {[
              { label: 'Hari', value: timeLeft.days },
              { label: 'Jam', value: timeLeft.hours },
              { label: 'Menit', value: timeLeft.minutes },
              { label: 'Detik', value: timeLeft.seconds },
            ].map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-[#202F29]/70 border border-[#B6A078]/30 text-center">
                <span className="block font-serif text-lg sm:text-xl text-[#F9F6EE] font-semibold">
                  {item.value}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#B6A078]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <ChevronDown className="w-5 h-5 text-[#B6A078] animate-bounce" />
          </div>
        </section>

        {/* ========================================================= */}
        {/* 6. BAGIAN ISI BERWARNA KREM DENGAN SAMBUTAN DI TENGAH */}
        {/* ========================================================= */}
        <section className="bg-[#F9F6EE] px-6 py-16 text-center">
          <div className="max-w-md mx-auto">
            {/* Ayat Suci / Quote */}
            {invitation.verse_text && (
              <div className="mb-10 p-6 rounded-2xl bg-[#FFFFFF] border border-[#B6A078]/25 shadow-sm">
                <Sparkles className="w-5 h-5 text-[#B6A078] mx-auto mb-3" />
                <p className="font-serif italic text-xs sm:text-sm text-[#77756E] leading-relaxed whitespace-pre-line">
                  {invitation.verse_text}
                </p>
              </div>
            )}

            {/* Kata Sambutan */}
            <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#B6A078]">
              SALAM HANGAT
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#2D4038] mt-2 mb-4">
              Maha Suci Allah
            </h2>
            <p className="text-xs sm:text-sm text-[#77756E] leading-relaxed whitespace-pre-line font-light">
              {invitation.greeting_quote}
            </p>

            {/* Profil Mempelai */}
            <div className="mt-14 space-y-10">
              {/* Mempelai Pria */}
              <div className="flex flex-col items-center">
                <div className="w-28 h-28 rounded-full overflow-hidden p-1 border-2 border-[#B6A078] shadow-md mb-4 bg-white">
                  <img
                    src={invitation.couple.groom_photo}
                    alt={invitation.couple.groom_name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-[#2D4038] font-semibold">
                  {invitation.couple.groom_name}
                </h3>
                <p className="text-xs text-[#77756E] mt-1 max-w-xs font-light">
                  {invitation.couple.groom_parents}
                </p>
              </div>

              {/* Tanda Dan (&) */}
              <div className="font-serif text-3xl text-[#B6A078] italic">&</div>

              {/* Mempelai Wanita */}
              <div className="flex flex-col items-center">
                <div className="w-28 h-28 rounded-full overflow-hidden p-1 border-2 border-[#B6A078] shadow-md mb-4 bg-white">
                  <img
                    src={invitation.couple.bride_photo}
                    alt={invitation.couple.bride_name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-[#2D4038] font-semibold">
                  {invitation.couple.bride_name}
                </h3>
                <p className="text-xs text-[#77756E] mt-1 max-w-xs font-light">
                  {invitation.couple.bride_parents}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 7. KARTU INFORMASI AKAD DAN RESEPSI */}
        {/* ========================================================= */}
        <section className="bg-[#F9F6EE] px-6 py-6 border-t border-[#B6A078]/20">
          <div className="text-center mb-8">
            <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#B6A078]">
              WAKTU & TEMPAT
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#2D4038] mt-1">
              Rangkaian Acara
            </h2>
          </div>

          <div className="max-w-md mx-auto space-y-6">
            {/* Kartu Akad Nikah */}
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#B6A078]/30 shadow-sm text-center relative overflow-hidden">
              <div className="w-10 h-10 mx-auto rounded-full bg-[#F4EFE6] flex items-center justify-center text-[#B6A078] mb-3">
                <Heart className="w-5 h-5 fill-[#B6A078]" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#2D4038] font-medium">
                {invitation.akad.title}
              </h3>
              
              <div className="mt-4 pt-4 border-t border-[#F4EFE6] space-y-2 text-xs text-[#77756E]">
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4 text-[#B6A078]" />
                  <span>{invitation.akad.date}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-[#B6A078]" />
                  <span>{invitation.akad.time_start} - {invitation.akad.time_end}</span>
                </div>
                <div className="flex items-start justify-center gap-2 pt-2">
                  <MapPin className="w-4 h-4 text-[#B6A078] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#2D4038] font-medium">{invitation.akad.venue_name}</strong>
                    <span className="font-light">{invitation.akad.address}</span>
                  </div>
                </div>
              </div>

              {invitation.akad.maps_url && (
                <a
                  href={invitation.akad.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D4038] text-[#F9F6EE] text-xs font-medium tracking-wider uppercase transition hover:bg-[#202F29]"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#B6A078]" />
                  Buka Peta Akad
                </a>
              )}
            </div>

            {/* Kartu Resepsi */}
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#B6A078]/30 shadow-sm text-center relative overflow-hidden">
              <div className="w-10 h-10 mx-auto rounded-full bg-[#F4EFE6] flex items-center justify-center text-[#B6A078] mb-3">
                <Sparkles className="w-5 h-5 text-[#B6A078]" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#2D4038] font-medium">
                {invitation.resepsi.title}
              </h3>
              
              <div className="mt-4 pt-4 border-t border-[#F4EFE6] space-y-2 text-xs text-[#77756E]">
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4 text-[#B6A078]" />
                  <span>{invitation.resepsi.date}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-[#B6A078]" />
                  <span>{invitation.resepsi.time_start} - {invitation.resepsi.time_end}</span>
                </div>
                <div className="flex items-start justify-center gap-2 pt-2">
                  <MapPin className="w-4 h-4 text-[#B6A078] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#2D4038] font-medium">{invitation.resepsi.venue_name}</strong>
                    <span className="font-light">{invitation.resepsi.address}</span>
                  </div>
                </div>
              </div>

              {/* 8. Tombol "Buka Peta" */}
              {invitation.resepsi.maps_url && (
                <a
                  href={invitation.resepsi.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D4038] text-[#F9F6EE] text-xs font-medium tracking-wider uppercase transition hover:bg-[#202F29]"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#B6A078]" />
                  Buka Peta Resepsi
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* LOVE STORY / PERJALANAN CINTA (JIKA ADA) */}
        {/* ========================================================= */}
        {invitation.love_stories && invitation.love_stories.length > 0 && (
          <section className="bg-[#F9F6EE] px-6 py-12 border-t border-[#B6A078]/20">
            <div className="text-center mb-8">
              <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#B6A078]">
                OUR JOURNEY
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#2D4038] mt-1">
                Kisah Perjalanan Cinta
              </h2>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              {invitation.love_stories.map((story, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white border border-[#B6A078]/25 shadow-sm">
                  <span className="inline-block text-[10px] uppercase font-bold tracking-widest text-[#B6A078] px-2.5 py-1 rounded bg-[#F4EFE6] mb-2">
                    {story.year_or_date}
                  </span>
                  <h4 className="font-serif text-base text-[#2D4038] font-semibold">{story.title}</h4>
                  <p className="text-xs text-[#77756E] mt-1 leading-relaxed font-light">{story.story}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* GALERI PREWEDDING (JIKA ADA) */}
        {/* ========================================================= */}
        {invitation.gallery_photos && invitation.gallery_photos.length > 0 && (
          <section className="bg-[#F9F6EE] px-6 py-12 border-t border-[#B6A078]/20">
            <div className="text-center mb-8">
              <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#B6A078]">
                MOMENTS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#2D4038] mt-1">
                Galeri Prewedding
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              {invitation.gallery_photos.map((photoUrl, idx) => (
                <div key={idx} className="overflow-hidden rounded-xl border border-[#B6A078]/30 aspect-square shadow-sm bg-white">
                  <img
                    src={photoUrl}
                    alt={`Prewedding Photo ${idx + 1}`}
                    className="w-full h-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* AMPLOP DIGITAL & HADIAH PERNIKAHAN */}
        {/* ========================================================= */}
        {invitation.digital_envelopes && invitation.digital_envelopes.length > 0 && (
          <section className="bg-[#F9F6EE] px-6 py-12 border-t border-[#B6A078]/20">
            <div className="text-center mb-8">
              <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#B6A078]">
                TANDA KASIH
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#2D4038] mt-1">
                Amplop Digital
              </h2>
              <p className="text-xs text-[#77756E] max-w-xs mx-auto mt-2 font-light">
                Doa restu Anda merupakan karunia terindah bagi kami. Namun jika ingin memberikan tanda kasih, dapat melalui:
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              {invitation.digital_envelopes.map((env, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white border border-[#B6A078]/30 shadow-sm text-center">
                  <Gift className="w-5 h-5 text-[#B6A078] mx-auto mb-2" />
                  <p className="text-xs font-semibold tracking-wider text-[#2D4038] uppercase">{env.bank_name}</p>
                  <div className="my-2 p-2 rounded-lg bg-[#F4EFE6] inline-flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#2D4038]">{env.account_number}</span>
                    <button
                      onClick={() => handleCopyAccount(env.account_number, idx)}
                      className="text-xs p-1 rounded bg-[#2D4038] text-[#F9F6EE] hover:bg-[#202F29] transition"
                      title="Salin Nomor Rekening"
                    >
                      {copiedBankIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs text-[#77756E]">a.n {env.account_holder}</p>
                  {copiedBankIdx === idx && (
                    <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
                      Nomor rekening berhasil disalin!
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* 9 & 10. PENERIMA UNDANGAN & FORM RSVP */}
        {/* ========================================================= */}
        <section id="rsvp-section" className="bg-[#F9F6EE] px-6 py-14 border-t border-[#B6A078]/20">
          <div className="text-center mb-8">
            <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#B6A078]">
              RESERVASI KEHADIRAN
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#2D4038] mt-1">
              Konfirmasi Kehadiran & Doa
            </h2>
            <p className="text-xs text-[#77756E] mt-2 font-light">
              Membantu kami dalam mempersiapkan jamuan terbaik untuk Anda
            </p>
          </div>

          <div className="max-w-md mx-auto">
            {/* Personalisasi Sapaan Penerima */}
            <div className="mb-6 p-4 rounded-xl bg-[#2D4038] text-[#F9F6EE] text-center border border-[#B6A078]/40">
              <span className="text-[10px] uppercase tracking-widest text-[#B6A078] block">Penerima Undangan</span>
              <h4 className="font-serif text-lg font-medium mt-0.5">{guestName}</h4>
            </div>

            {/* Form RSVP */}
            <form onSubmit={handleRSVPSubmit} className="p-6 rounded-2xl bg-white border border-[#B6A078]/30 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#2D4038] uppercase tracking-wider mb-1.5">
                  Nama Anda
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder={guestName}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#B6A078]/40 text-xs focus:outline-none focus:ring-2 focus:ring-[#B6A078] bg-[#F9F6EE]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2D4038] uppercase tracking-wider mb-1.5">
                  Konfirmasi Kehadiran
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'hadir', label: 'Hadir' },
                    { id: 'tidak', label: 'Tidak Hadir' },
                    { id: 'ragu', label: 'Masih Ragu' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFormAttendance(opt.id as any)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium transition border ${
                        formAttendance === opt.id
                          ? 'bg-[#2D4038] text-[#F9F6EE] border-[#2D4038]'
                          : 'bg-white text-[#77756E] border-[#B6A078]/30 hover:border-[#B6A078]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {formAttendance !== 'tidak' && (
                <div>
                  <label className="block text-xs font-medium text-[#2D4038] uppercase tracking-wider mb-1.5">
                    Jumlah Orang yang Hadir
                  </label>
                  <select
                    value={formPax}
                    onChange={(e) => setFormPax(parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#B6A078]/40 text-xs focus:outline-none focus:ring-2 focus:ring-[#B6A078] bg-[#F9F6EE]/40"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} Orang
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#2D4038] uppercase tracking-wider mb-1.5">
                  Ucapan & Doa Restu
                </label>
                <textarea
                  required
                  rows={3}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Tuliskan ucapan selamat dan doa restu terbaik untuk kedua mempelai..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#B6A078]/40 text-xs focus:outline-none focus:ring-2 focus:ring-[#B6A078] bg-[#F9F6EE]/40"
                ></textarea>
              </div>

              {rsvpSuccessMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-800">
                  {rsvpSuccessMessage}
                </div>
              )}

              {rsvpError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-800">
                  {rsvpError}
                </div>
              )}

              {/* 10. Tombol "Konfirmasi Kehadiran" */}
              <button
                type="submit"
                disabled={isSubmittingRSVP}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#2D4038] text-[#F9F6EE] text-xs font-medium tracking-widest uppercase transition-all duration-300 hover:bg-[#202F29] disabled:opacity-50"
              >
                {isSubmittingRSVP ? (
                  <span>Mengirim...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-[#B6A078]" />
                    <span>Kirim Konfirmasi Kehadiran</span>
                  </>
                )}
              </button>
            </form>

            {/* Share to WhatsApp Button */}
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowShareModal(true)}
                className="inline-flex items-center gap-2 text-xs font-medium text-[#2D4038] hover:text-[#B6A078] transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                Bagikan Undangan Ini ke Sahabat / WhatsApp
              </button>
            </div>

            {/* Daftar Ucapan & Doa */}
            <div className="mt-10">
              <h4 className="font-serif text-lg text-[#2D4038] font-medium mb-3 flex items-center justify-between">
                <span>Doa Restu Tamu ({rsvps.length})</span>
              </h4>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {rsvps.map((r) => (
                  <div key={r.id} className="p-4 rounded-xl bg-white border border-[#B6A078]/25 shadow-xs text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-[#2D4038]">{r.guest_name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        r.attendance === 'hadir' ? 'bg-emerald-100 text-emerald-800' :
                        r.attendance === 'ragu' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {r.attendance === 'hadir' ? 'Hadir' : r.attendance === 'ragu' ? 'Ragu' : 'Tidak Hadir'}
                      </span>
                    </div>
                    <p className="text-xs text-[#77756E] leading-relaxed font-light">{r.message}</p>
                    <span className="text-[9px] text-[#77756E]/60 mt-1 block">
                      {new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 11. FOOTER HIJAU GELAP (#2D4038) DENGAN UCAPAN TERIMA KASIH */}
        {/* ========================================================= */}
        <footer className="bg-[#2D4038] text-[#F9F6EE] px-6 py-16 text-center border-t border-[#B6A078]/30">
          <div className="max-w-md mx-auto">
            <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#B6A078] mb-3 block">
              TERIMA KASIH
            </span>
            <p className="text-xs sm:text-sm text-[#F9F6EE]/80 leading-relaxed font-light max-w-sm mx-auto mb-6">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu bagi kami berdua.
            </p>
            <div className="gold-divider max-w-xs mx-auto my-6"></div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#F9F6EE] tracking-wide font-light">
              {invitation.couple.groom_nickname} <span className="text-[#B6A078] italic">&</span> {invitation.couple.bride_nickname}
            </h3>
            <p className="text-[10px] uppercase tracking-widest text-[#B6A078] mt-2">
              Keluarga Besar Bpk. Bambang Suryo & Bpk. Suryono
            </p>

            <div className="mt-12 text-[10px] text-[#F9F6EE]/50 tracking-wider">
              Powered by Nuptia — Exclusive Wedding Invitation
            </div>
          </div>
        </footer>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* WHATSAPP SHARE MODAL */}
      {/* ------------------------------------------------------------- */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white border border-[#B6A078]/40 shadow-2xl text-left">
            <h3 className="font-serif text-xl text-[#2D4038] font-semibold mb-2">
              Bagikan Undangan
            </h3>
            <p className="text-xs text-[#77756E] mb-4">
              Salin tautan atau kirim langsung format undangan personalisasi via WhatsApp.
            </p>

            <div className="p-3 rounded-xl bg-[#F9F6EE] border border-[#B6A078]/30 mb-4">
              <span className="text-[10px] text-[#77756E] uppercase tracking-wider block mb-1">Tautan Undangan:</span>
              <p className="font-mono text-xs text-[#2D4038] break-all select-all">{shareUrl}</p>
            </div>

            <div className="flex gap-2">
              <a
                href={`https://api.whatsapp.com/send?text=${whatsappShareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
              >
                Kirim via WhatsApp
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  alert('Tautan undangan telah disalin ke clipboard!');
                }}
                className="py-2.5 px-4 rounded-xl border border-[#B6A078] text-[#2D4038] text-xs font-semibold hover:bg-[#F9F6EE] transition"
              >
                Salin Tautan
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 text-right">
              <button
                onClick={() => setShowShareModal(false)}
                className="text-xs text-[#77756E] hover:text-[#2D4038]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
