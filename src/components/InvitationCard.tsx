/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail, Calendar, MapPin, Clock, Star, BookOpen, Send,
  Copy, Check, Heart, Share2,
  PenTool, Navigation, CheckSquare
} from 'lucide-react';

interface Wish {
  id: string;
  name: string;
  prefix: string;
  message: string;
  timestamp: number;
  likes: number;
}

interface InvitationCardProps {
  view?: 'cover' | 'details';
}

const DEFAULT_GUEST_NAME = 'quý vị và gia đình';

export default function InvitationCard({ view = 'details' }: InvitationCardProps) {
  const [isOpen, setIsOpen] = useState(view === 'details');
  const [isOpening, setIsOpening] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPrefix, setGuestPrefix] = useState('');
  const [isShared, setIsShared] = useState(false);

  // Guest book states
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newWishName, setNewWishName] = useState('');
  const [newWishPrefix, setNewWishPrefix] = useState('');
  const [newWishMessage, setNewWishMessage] = useState('');
  const [likedWishes, setLikedWishes] = useState<string[]>([]);
  const [showWishSuccess, setShowWishSuccess] = useState(false);

  // Flower petals state
  const [petals, setPetals] = useState<any[]>([]);
  const [showDetailsExtras, setShowDetailsExtras] = useState(view === 'details');

  useEffect(() => {
    setIsOpen(view === 'details');
    setShowDetailsExtras(view === 'details');
    if (view === 'details') {
      generateFlowerPetals();
    }
  }, [view]);

  const normalizeGuestParam = (value: string) => value.trim();

  const getGuestParam = () => {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams(window.location.search);
    return normalizeGuestParam(params.get('guest') || params.get('name') || params.get('to') || '');
  };

  const syncGuestRoute = () => {
    if (typeof window === 'undefined') return;

    const preservedParams = new URLSearchParams(window.location.search);
    const guest = getGuestParam() || DEFAULT_GUEST_NAME;

    preservedParams.delete('guest');
    preservedParams.delete('name');
    preservedParams.delete('to');
    preservedParams.set('guest', guest);

    window.history.replaceState(null, '', `/?${preservedParams.toString()}`);
  };

  // Parse query parameters on load to read the dynamic guest name and title prefix
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const guestParam = getGuestParam();
      const prefixParam = params.get('prefix') || params.get('title') || '';

      const trimmedName = guestParam.trim();
      const trimmedPrefix = prefixParam.trim();

      setGuestName(trimmedName || DEFAULT_GUEST_NAME);
      setGuestPrefix(trimmedPrefix);

      if (trimmedName) {
        setNewWishName(trimmedName);
      }
      if (trimmedPrefix) {
        setNewWishPrefix(trimmedPrefix);
      }
    }
  }, []);

  // Load and seed Guest Book wishes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('manh_hung_graduation_wishes');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Filter out seed comments to clean them up for existing visitors
          const customWishes = parsed.filter((w: Wish) => !w.id.startsWith('seed-'));
          setWishes(customWishes);
          localStorage.setItem('manh_hung_graduation_wishes', JSON.stringify(customWishes));
        } catch (e) {
          console.error(e);
        }
      } else {
        setWishes([]);
        localStorage.setItem('manh_hung_graduation_wishes', JSON.stringify([]));
      }

      const savedLikes = localStorage.getItem('manh_hung_liked_wishes');
      if (savedLikes) {
        try {
          setLikedWishes(JSON.parse(savedLikes));
        } catch (e) { }
      }
    }
  }, []);

  // Generate falling flower petals simulation
  const generateFlowerPetals = () => {
    const colors = [
      '#FFB7C5', // Soft cherry blossom pink
      '#FFA2B6', // Elegant peach petal
      '#F78DA7', // Warm pink
      '#FFD1DC', // Pastel baby pink
      '#FFE4E1', // Misty rose
      '#C5A059', // Elegant golden flake
      '#FFF0BD', // Shimmering light gold
    ];

    const petalCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 18 : 30;
    const newPetals = Array.from({ length: petalCount }, (_, i) => {
      const size = Math.random() * 16 + 10; // 10px to 26px
      const petalType = Math.floor(Math.random() * 3); // 3 unique SVG paths
      const x = Math.random() * 100; // starting viewport X percentage
      const y = -15 - Math.random() * 80; // staggered spawn height above viewport
      const delay = Math.random() * 6; // random stagger timing
      const duration = Math.random() * 8 + 6; // falling speed (6s to 14s)
      const rotateStart = Math.random() * 360;
      const rotateEnd = Math.random() * 360 + 720; // multiple full spins
      const swingAmount = Math.random() * 25 + 15; // horizontal swing amplitude

      return {
        id: `petal-${i}-${Date.now()}`,
        x,
        y,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay,
        duration,
        rotateStart,
        rotateEnd,
        swingAmount,
        petalType
      };
    });
    setPetals(newPetals);
  };

  const handleShareCard = () => {
    if (typeof window !== 'undefined') {
      const shareTitle = 'Lễ Tốt Nghiệp Cử Nhân - Nguyễn Mạnh Hùng';
      const shareText = guestName
        ? `Trân trọng kính mời ${guestPrefix ? guestPrefix + ' ' : ''}${guestName} tham dự Lễ tốt nghiệp của Hùng tại Hội trường Nguyễn Văn Đạo, Đại học Quốc gia Hà Nội!`
        : 'Trân trọng kính mời quý khách tham dự Lễ tốt nghiệp của tôi tại Hội trường Nguyễn Văn Đạo, Đại học Quốc gia Hà Nội!';
      const shareUrl = window.location.href;

      if (navigator.share) {
        navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        }).catch(() => { });
      } else {
        navigator.clipboard.writeText(shareUrl);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 3000);
      }
    }
  };

  const triggerOpenSequence = () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);

    // Smooth physical envelope flip open timing
    setTimeout(() => {
      setIsOpening(false);
      setIsOpen(true);
      syncGuestRoute();
      window.dispatchEvent(new CustomEvent('graduation-card-opened'));

      window.requestAnimationFrame(() => {
        setTimeout(() => setShowDetailsExtras(true), 320);
        setTimeout(generateFlowerPetals, 620);
      });
    }, 760);
  };

  // Preset quick greetings to make signing incredibly quick and fun
  const presetGreetings = [
    '🎓 Chúc mừng Tân Cử nhân xuất sắc!',
    '🚀 Bay cao bay xa gặt hái triệu thành công nhé!',
    '🌟 Tự hào về cậu quá, chúc mừng tốt nghiệp xuất sắc!',
    '❤️ Rất vinh hạnh được chung vui cùng cậu trong ngày trọng đại!',
  ];

  const handleSelectPreset = (greet: string) => {
    setNewWishMessage(greet);
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishName.trim() || !newWishMessage.trim()) return;

    const newWish: Wish = {
      id: 'wish-' + Date.now(),
      name: newWishName.trim(),
      prefix: newWishPrefix.trim(),
      message: newWishMessage.trim(),
      timestamp: Date.now(),
      likes: 0
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('manh_hung_graduation_wishes', JSON.stringify(updated));
    }

    setNewWishMessage('');
    setShowWishSuccess(true);
    setTimeout(() => setShowWishSuccess(false), 3000);
  };

  const handleLikeWish = (id: string) => {
    if (likedWishes.includes(id)) {
      const newLikes = likedWishes.filter(item => item !== id);
      setLikedWishes(newLikes);
      const updatedWishes = wishes.map(w => w.id === id ? { ...w, likes: Math.max(0, w.likes - 1) } : w);
      setWishes(updatedWishes);
      localStorage.setItem('manh_hung_liked_wishes', JSON.stringify(newLikes));
      localStorage.setItem('manh_hung_graduation_wishes', JSON.stringify(updatedWishes));
    } else {
      const newLikes = [...likedWishes, id];
      setLikedWishes(newLikes);
      const updatedWishes = wishes.map(w => w.id === id ? { ...w, likes: w.likes + 1 } : w);
      setWishes(updatedWishes);
      localStorage.setItem('manh_hung_liked_wishes', JSON.stringify(newLikes));
      localStorage.setItem('manh_hung_graduation_wishes', JSON.stringify(updatedWishes));
    }
  };

  return (
    <div
      id="uet-invitation-section"
      className={`relative px-4 flex flex-col items-center justify-start bg-[#ECE9E2] text-slate-800 overflow-x-hidden ${
        isOpen ? 'py-12 md:py-20 min-h-screen' : 'w-full pt-8 md:pt-12'
      }`}
    >

      {/* Decorative Elegant Soft Vignette / Ambient Shadows */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/5 pointer-events-none z-0"></div>

      {/* Elegant silk ribbon lying across the corner of the workspace table */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#C5A059]/15 to-transparent pointer-events-none transform rotate-12 origin-top-right z-0"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#002147]/5 to-transparent pointer-events-none transform -rotate-12 origin-bottom-left z-0"></div>

      {/* --- PREMIUM FLUTTERING FLOWER PETALS SIMULATOR --- */}
      {isOpen && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {petals.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                x: `${p.x}vw`,
                y: `${p.y}vh`,
                rotate: p.rotateStart,
                opacity: 0
              }}
              animate={{
                y: '110vh',
                rotate: p.rotateEnd,
                opacity: [0, 0.9, 0.9, 0],
                x: [
                  `${p.x}vw`,
                  `${p.x + (p.swingAmount / 8)}vw`,
                  `${p.x - (p.swingAmount / 8)}vw`,
                  `${p.x + (p.swingAmount / 15)}vw`
                ]
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: 'easeInOut',
                repeat: Infinity,
              }}
              className="absolute"
              style={{
                width: p.size,
                height: p.size,
              }}
            >
              <svg viewBox="0 0 24 24" fill={p.color} className="w-full h-full drop-shadow-[0_2px_5px_rgba(0,0,0,0.12)]">
                {p.petalType === 0 ? (
                  /* Elegant curved cherry blossom petal path */
                  <path d="M12,2 C15.5,2 19,5.5 19,10.5 C19,15.5 15.5,19.5 12,21.5 C8.5,19.5 5,15.5 5,10.5 C5,5.5 8.5,2 12,2 Z" />
                ) : p.petalType === 1 ? (
                  /* Heart-shaped split petal path */
                  <path d="M12,5 C10.5,2 6.5,1.5 4,4.5 C1.5,7.5 3.5,13.5 12,19.5 C20.5,13.5 22.5,7.5 20,4.5 C17.5,1.5 13.5,2 12,5 Z" />
                ) : (
                  /* Fluttering organic leaf/petal path */
                  <path d="M2.5,12 C2.5,5.5 8.5,1.5 17,1.5 C17,10 13,19.5 2.5,12 Z" />
                )}
              </svg>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {!isOpen ? (
          /* PART 1: PHYSICAL ENVELOPE VIEW (Bìa thư sang trọng gấp kín) */
          <motion.div
            key="envelope-view"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -18 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-2xl aspect-[1.5/1] bg-gradient-to-br from-[#1b2a47] to-[#101c33] rounded-xl shadow-[0_30px_70px_-15px_rgba(0,0,0,0.65)] relative overflow-hidden border border-[#C5A059]/30 flex flex-col justify-between p-8 z-10 will-change-transform"
          >
            {/* Subtle premium paper fiber texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-repeat" style={{ backgroundImage: 'radial-gradient(circle, #fff 10%, transparent 10%)', backgroundSize: '3px 3px' }}></div>

            {/* ENVELOPE TRIANGULAR FLAP */}
            <div className="absolute top-0 left-0 w-full h-[62%] pointer-events-none z-20">
              <motion.div
                className="w-full h-full origin-top relative"
                style={{ perspective: 1000 }}
                animate={isOpening ? {
                  rotateX: -178,
                  transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] }
                } : { rotateX: 0 }}
              >
                {/* SVG Flap with delicate golden border */}
                <svg className="absolute inset-0 w-full h-full drop-shadow-[0_8px_10px_rgba(0,0,0,0.45)]" viewBox="0 0 600 240" preserveAspectRatio="none">
                  <path
                    d="M 0,0 L 600,0 L 300,240 Z"
                    fill="url(#flapGradient)"
                    stroke="#C5A059"
                    strokeWidth="0.75"
                    strokeOpacity="0.4"
                  />
                  <defs>
                    <linearGradient id="flapGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e2e4a" />
                      <stop offset="100%" stopColor="#131e33" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-x-0 top-[17%] z-10 flex flex-col items-center text-center pointer-events-none px-8">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#C5A059]/80"></span>
                    <span className="font-serif text-[10px] md:text-xs font-bold uppercase tracking-[0.28em] text-[#D8B862] drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)]">
                      Thiệp mời
                    </span>
                    <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#C5A059]/80"></span>
                  </div>
                  <span className="font-serif text-lg md:text-[1.55rem] font-black uppercase tracking-[0.12em] text-[#FFF0BD] drop-shadow-[0_3px_8px_rgba(0,0,0,0.65)] leading-tight">
                    Trân trọng kính mời
                  </span>
                  <span className="mt-3 h-[1.5px] w-16 bg-[#C5A059]/75"></span>
                </div>
              </motion.div>
            </div>

            {/* Back Pocket Body */}
            <div className="absolute bottom-0 left-0 w-full h-[38%] bg-gradient-to-t from-[#101c33] to-[#162540] border-t border-[#C5A059]/10 z-10"></div>

            {/* CENTRAL WAX SEAL */}
            <div className="absolute top-[62%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center">
              {/* Ribbons */}
              <motion.div
                className="absolute top-[36px] left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none"
                animate={isOpening ? { opacity: 0, y: 14, transition: { duration: 0.28 } } : { opacity: 1 }}
              >
                <div
                  className="w-4.5 h-16 bg-[#13233c] origin-top rotate-[-12deg] rounded-b-sm shadow-md border-r border-black/25"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 50% 100%, 0 90%)' }}
                ></div>
                <div
                  className="w-4.5 h-16 bg-[#0f1d33] origin-top rotate-[12deg] rounded-b-sm shadow-md border-l border-black/25"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 50% 100%, 0 90%)' }}
                ></div>
              </motion.div>

              <div className="absolute w-20 h-20 rounded-full bg-amber-500/10 blur-xl pointer-events-none"></div>

              <motion.button
                type="button"
                onClick={triggerOpenSequence}
                disabled={isOpening}
                className="w-18 h-18 rounded-full bg-gradient-to-b from-[#FFF0BD] via-[#D5AF38] to-[#8A6715] flex items-center justify-center border-[4px] border-[#FFF0BD]/80 shadow-[0_10px_25px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.5)] relative active:scale-95 transition-all cursor-pointer group/seal"
                animate={isOpening ? {
                  scale: [1, 1.12, 0.86],
                  opacity: [1, 1, 0],
                  rotate: [0, 8, -6, 0]
                } : {
                  scale: [1, 1.05, 1],
                }}
                transition={isOpening ? { duration: 0.42 } : { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              >
                <div className="absolute -inset-1 rounded-full border-2 border-[#D5AF38]/30 pointer-events-none opacity-80"></div>
                <div className="w-11.5 h-11.5 rounded-full border border-double border-[#FFF0BD]/50 flex items-center justify-center bg-gradient-to-br from-[#AA7D15] to-[#593F02] shadow-inner relative overflow-hidden">
                  <span className="font-serif text-2xl font-black text-[#FFF0BD] leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]">
                    H
                  </span>
                </div>
              </motion.button>

              {!isOpening && (
                <span className="font-serif text-[9px] text-[#C5A059] tracking-[0.2em] uppercase font-bold animate-pulse mt-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  CHẠM ĐỂ MỞ
                </span>
              )}
            </div>
          </motion.div>
        ) : (
          /* PART 2: OPENED DYNAMIC SCROLLING VIEW (Thiệp mở rộng có đầy đủ Lịch trình, Bản đồ & Lưu bút) */
          <div className="flex flex-col items-center gap-8 w-full max-w-2xl z-10 py-2">

            {/* Section A: The Main Premium Gold-Foiled Invitation Card */}
            <motion.div
              key="opened-card"
              initial={{ opacity: 0, scale: 0.98, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full bg-[#FCFAF5] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.18)] p-6 md:p-14 relative text-slate-800 overflow-hidden border border-[#C5A059]/20 will-change-transform"
            >
              {/* Double-Line Elegant notched gold frame (Exactly matching classic invitation paper borders) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none p-4" viewBox="0 0 400 600" preserveAspectRatio="none">
                <path
                  d="M 30 15 L 370 15 A 15 15 0 0 1 385 30 L 385 570 A 15 15 0 0 1 370 585 L 30 585 A 15 15 0 0 1 15 570 L 15 30 A 15 15 0 0 1 30 15 Z"
                  fill="none"
                  stroke="#C5A059"
                  strokeWidth="1.5"
                />
                <path
                  d="M 34 19 L 366 19 A 12 12 0 0 1 378 31 L 378 569 A 12 12 0 0 1 366 581 L 34 581 A 12 12 0 0 1 22 569 L 22 31 A 12 12 0 0 1 34 19 Z"
                  fill="none"
                  stroke="#C5A059"
                  strokeWidth="0.5"
                  strokeOpacity="0.7"
                />
              </svg>

              <div className="relative z-10 flex flex-col items-center text-center">

                {/* 1. TOP HEADER GRADUATION CAP */}
                <div className="flex flex-col items-center mb-5 mt-1">
                  <div className="relative w-32 h-18 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full text-[#C5A059]" viewBox="0 0 120 80" fill="currentColor">
                      <path d="M 42,52 C 34,47 30,34 34,22" fill="none" stroke="#C5A059" strokeWidth="1.25" />
                      <path d="M 34,22 Q 29,24 30,28 Q 34,26 34,22" />
                      <path d="M 36,30 Q 30,32 32,36 Q 36,34 36,30" />
                      <path d="M 38,38 Q 32,42 35,46 Q 39,42 38,38" />
                      <path d="M 41,45 Q 35,51 38,54 Q 42,49 41,45" />

                      <path d="M 78,52 C 86,47 90,34 86,22" fill="none" stroke="#C5A059" strokeWidth="1.25" />
                      <path d="M 86,22 Q 91,24 90,28 Q 86,26 86,22" />
                      <path d="M 84,30 Q 90,32 88,36 Q 84,34 84,30" />
                      <path d="M 82,38 Q 88,42 85,46 Q 81,42 82,38" />
                      <path d="M 79,45 Q 85,51 82,54 Q 78,49 79,45" />
                    </svg>

                    <div className="z-10 text-[#C5A059] pb-1">
                      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" fill="currentColor" fillOpacity="0.25" />
                        <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 w-32 justify-center -mt-1">
                    <div className="w-1 h-1 bg-[#C5A059] rotate-45"></div>
                    <div className="w-1.5 h-1.5 bg-[#C5A059] rotate-45"></div>
                    <div className="w-1 h-1 bg-[#C5A059] rotate-45"></div>
                  </div>
                </div>

                {/* 2. MAIN CORE GREETING */}
                <div className="space-y-1 mb-8">
                  <h1 className="font-serif text-[1.7rem] md:text-3.5xl font-black tracking-[0.18em] text-[#001A3A] uppercase leading-tight">
                    Thiệp Mời
                  </h1>
                  <h2 className="font-serif text-3.5xl md:text-4xl font-black tracking-[0.05em] text-[#002147] uppercase">
                    Lễ Tốt Nghiệp
                  </h2>

                  <div className="flex items-center justify-center gap-2 py-2">
                    <div className="w-20 h-[0.75px] bg-[#C5A059]/50"></div>
                    <div className="w-1.5 h-1.5 rotate-45 bg-[#C5A059] flex-shrink-0"></div>
                    <div className="w-20 h-[0.75px] bg-[#C5A059]/50"></div>
                  </div>
                </div>

                {/* 3. CORE INVITING GUEST TEXT */}
                <div className="space-y-4 mb-8 w-full max-w-sm">
                  <p className="font-serif text-base text-[#9A6F12] italic font-bold">Trân trọng kính mời</p>

                  <div className="space-y-1 py-1">
                    {guestPrefix && (
                      <span className="font-serif text-sm font-bold uppercase tracking-widest text-[#475569] block">
                        {guestPrefix}
                      </span>
                    )}

                    {guestName ? (
                      <h3 className="font-cursive text-4xl md:text-4.5xl font-extrabold text-[#002147] tracking-wide leading-relaxed py-1.5 drop-shadow-sm">
                        {guestName}
                      </h3>
                    ) : (
                      <div className="h-6 w-36 border-b border-dashed border-[#C5A059]/40 mx-auto my-3"></div>
                    )}
                  </div>

                  <p className="font-serif text-sm md:text-base font-semibold text-[#475569]">đến tham dự Lễ tốt nghiệp của</p>

                  <h4 className="font-serif text-2.5xl md:text-3xl font-black text-[#001A3A] uppercase tracking-wider py-1 border-b border-[#C5A059]/35 inline-block px-4">
                    NGUYỄN MẠNH HÙNG
                  </h4>
                </div>

                {/* 4. KEY DATE & LOCATION DETAIL */}
                <div className="space-y-3.5 w-full max-w-sm mb-8 text-base font-serif font-semibold border-t border-b border-[#C5A059]/25 py-5">
                  <div className="flex items-center justify-center gap-2.5 text-[#001A3A]">
                    <Clock className="w-4.5 h-4.5 text-[#C5A059] shrink-0" />
                    <span>Thời gian: <strong className="font-black text-[#001A3A]">07:30</strong>, Chủ Nhật <strong className="font-black text-[#001A3A]">05/07/2026</strong></span>
                  </div>

                  <div className="w-full rounded-lg border border-[#C5A059]/25 bg-white/55 px-4 py-3 shadow-sm">
                    <div className="flex items-start gap-2.5 text-left">
                      <MapPin className="w-4.5 h-4.5 text-[#C5A059] shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="font-serif text-xs font-bold uppercase tracking-[0.16em] text-[#9A6F12]">Địa điểm</p>
                        <p className="font-serif text-base font-black text-[#001A3A] leading-snug">Hội trường Nguyễn Văn Đạo</p>
                        <p className="font-sans text-xs md:text-[13px] font-semibold text-[#334155] leading-relaxed">Đại học Quốc gia Hà Nội, 144 Xuân Thủy, Cầu Giấy</p>
                      </div>
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=H%E1%BB%99i+tr%C6%B0%E1%BB%9Dng+Nguy%E1%BB%85n+V%C4%83n+%C4%90%E1%BA%A1o+144+Xu%C3%A2n+Th%E1%BB%A7y"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#002147] text-[#C5A059] shadow-sm transition-colors hover:bg-[#01142B]"
                        title="Mở Google Maps"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* 5. POETIC CLOSING QUOTE */}
                <div className="space-y-4 w-full max-w-xs mb-4">
                  <p className="font-serif text-sm md:text-base font-semibold text-[#334155] leading-relaxed italic">
                    "Sự hiện diện của quý vị <br /> là niềm vinh hạnh to lớn đối với tôi."
                  </p>

                  <div className="flex items-center justify-center gap-1.5">
                    <div className="w-1.5 h-[0.5px] bg-[#C5A059]"></div>
                    <div className="w-3 h-[0.5px] bg-[#C5A059]"></div>
                    <svg className="w-5 h-5 text-[#C5A059]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21a9 9 0 0 1-6.4-15.4l1-.1a8 8 0 0 0 5.4 15.5z" opacity="0.4" />
                      <path d="M12 21a9 9 0 0 0 6.4-15.4l-1-.1a8 8 0 0 1-5.4 15.5z" opacity="0.4" />
                    </svg>
                    <div className="w-3 h-[0.5px] bg-[#C5A059]"></div>
                    <div className="w-1.5 h-[0.5px] bg-[#C5A059]"></div>
                  </div>

                  <p className="font-serif text-base font-bold text-[#001A3A] italic">Trân trọng kính mời!</p>
                </div>

                {/* 6. REAL TIME SHARE LINK ACTION */}
                <div className="mt-8 pt-4 border-t border-slate-100 w-full flex justify-center">
                  <button
                    type="button"
                    id="btn-share-card-opened"
                    onClick={handleShareCard}
                    className="bg-[#002147] hover:bg-[#01142B] text-white font-serif font-bold text-sm tracking-wider uppercase py-2.5 px-6 rounded-lg shadow-md hover:shadow-[#002147]/10 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {isShared ? (
                      <>
                        Đã sao chép liên kết! <Check className="w-4 h-4 text-emerald-400" />
                      </>
                    ) : (
                      <>
                        Chia sẻ thiệp mời của Hùng <Share2 className="w-3.5 h-3.5 text-[#C5A059]" />
                      </>
                    )}
                  </button>
                </div>

              </div>
            </motion.div>

            {showDetailsExtras && (
              /* Section B: Interactive Digital Guest Book (Sổ lưu bút lời chúc số) */
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="w-full bg-[#FCFAF5] rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.08)] p-6 md:p-10 relative border border-[#C5A059]/20"
              >
              <div className="text-center mb-6">
                <span className="font-serif text-sm text-[#9A6F12] tracking-[0.22em] uppercase font-black">Sổ Lưu Niệm</span>
                <h3 className="font-serif text-3xl md:text-[2rem] font-black text-[#001A3A] uppercase tracking-wider mt-1 leading-tight">Lưu Bút Chúc Mừng</h3>
                <div className="w-12 h-[1.5px] bg-[#C5A059] mx-auto mt-2.5"></div>
              </div>

              <p className="font-serif text-sm md:text-base font-medium text-[#334155] text-center leading-7 mb-6 max-w-md mx-auto">
                Hãy cùng gửi gắm những lời chúc tốt đẹp nhất hoặc những lời dặn dò, chia sẻ để lưu niệm cột mốc Cử nhân đầy ý nghĩa này cùng Nguyễn Mạnh Hùng!
              </p>

              {/* Digital entry form */}
              <form onSubmit={handleAddWish} className="bg-white border border-[#C5A059]/20 rounded-xl p-5 md:p-6 shadow-sm space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name field */}
	                  <div className="flex h-full flex-col gap-1.5">
		                    <label className="flex min-h-8 items-end text-sm font-serif font-bold text-[#002147] uppercase tracking-wider leading-tight">
	                      Tên của bạn <span className="text-rose-500">*</span>
	                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nhập tên của bạn (Ví dụ: Minh Quân, Thầy Nam...)"
                      value={newWishName}
                      onChange={(e) => setNewWishName(e.target.value)}
                      className="w-full text-sm font-serif font-semibold bg-[#FCFAF5] border border-slate-300 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] rounded-lg py-3 px-3.5 text-[#1E293B] placeholder:text-slate-500 outline-none transition-all"
                    />
                  </div>

                  {/* Prefix xưng hô */}
	                  <div className="flex h-full flex-col gap-1.5">
		                    <label className="flex min-h-8 items-end text-sm font-serif font-bold text-[#002147] uppercase tracking-wider leading-tight">
	                      Danh xưng xưng hô
	                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Bạn học, Chị gái, Đồng nghiệp..."
                      value={newWishPrefix}
                      onChange={(e) => setNewWishPrefix(e.target.value)}
                      className="w-full text-sm font-serif font-semibold bg-[#FCFAF5] border border-slate-300 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] rounded-lg py-3 px-3.5 text-[#1E293B] placeholder:text-slate-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Quick blessings selectors */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-serif font-bold text-[#002147] uppercase tracking-wider">
                    Gợi ý lời chúc nhanh
                  </label>
                  <div className="flex flex-wrap gap-1.5 py-0.5">
                    {presetGreetings.map((greet, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(greet)}
                        className="text-xs md:text-[13px] font-serif font-semibold bg-white hover:bg-[#002147]/5 border border-slate-300 hover:border-[#C5A059] text-[#475569] hover:text-[#002147] rounded-full py-1.5 px-3 transition-all cursor-pointer text-left"
                      >
                        {greet}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message input */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-serif font-bold text-[#002147] uppercase tracking-wider">
                    Lời chúc gửi tới Hùng <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Viết những lời chúc tốt đẹp, dặn dò thân ái nhất..."
                    value={newWishMessage}
                    onChange={(e) => setNewWishMessage(e.target.value)}
                    className="w-full text-sm font-serif font-semibold bg-[#FCFAF5] border border-slate-300 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] rounded-lg py-3 px-3.5 text-[#1E293B] placeholder:text-slate-500 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-1.5 text-xs font-serif font-semibold text-[#64748B]">
                    <PenTool className="w-3.5 h-3.5 text-[#C5A059]" /> Lưu bút điện tử công nghệ
                  </div>
                  <button
                    type="submit"
                    className="bg-[#002147] hover:bg-[#01142B] text-white font-serif font-bold text-sm tracking-wider uppercase py-2.5 px-5 rounded-lg shadow transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    Gửi Lời Chúc <Send className="w-3 h-3 text-[#C5A059]" />
                  </button>
                </div>
              </form>

              {/* Success Notification popups */}
              <AnimatePresence>
                {showWishSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-sm font-serif text-center mt-4 flex items-center justify-center gap-2"
                  >
                    <CheckSquare className="w-4 h-4 text-emerald-500" /> Cảm ơn bạn rất nhiều! Lời chúc của bạn đã được lưu bút thành công.
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Scrollable board displaying guest wishes */}
              <div className="mt-8 space-y-4 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin">
                {wishes.map((w) => {
                  const isLiked = likedWishes.includes(w.id);
                  const wishDate = new Date(w.timestamp).toLocaleDateString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                  });

                  return (
                    <motion.div
                      key={w.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-slate-100 rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all relative group"
                    >
                      {/* Decorative corner tag */}
                      <div className="absolute top-0 right-0 w-8 h-8 opacity-10 pointer-events-none border-t-2 border-r-2 border-[#C5A059] rounded-tr-xl"></div>

                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {w.prefix && (
	                              <span className="text-[10px] md:text-xs font-serif font-bold bg-[#C5A059]/10 text-[#AA7D15] py-0.5 px-2 rounded-full uppercase tracking-wider">
                                {w.prefix}
                              </span>
                            )}
                            <h5 className="font-serif font-black text-base text-[#002147]">{w.name}</h5>
                          </div>
                          <span className="text-xs text-[#64748B] font-sans font-semibold block mt-1">{wishDate}</span>
                        </div>

                        {/* Interactive heart button to express love */}
                        <button
                          type="button"
                          onClick={() => handleLikeWish(w.id)}
	                          className={`flex items-center gap-1 py-1 px-2.5 rounded-full border text-xs font-serif transition-all cursor-pointer ${isLiked
                            ? 'bg-rose-50 border-rose-200 text-rose-500 font-semibold'
                            : 'bg-slate-50 border-slate-300 hover:border-slate-400 text-[#475569] font-semibold'
                            }`}
                        >
                          <Heart className={`w-3 h-3 transition-transform ${isLiked ? 'scale-110 fill-rose-500 text-rose-500' : ''}`} />
                          <span>{w.likes}</span>
                        </button>
                      </div>

                      <p className="font-serif text-sm md:text-base font-medium text-[#334155] mt-3 leading-relaxed border-t border-slate-100 pt-2.5 whitespace-pre-line italic">
                        "{w.message}"
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              </motion.div>
            )}

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
