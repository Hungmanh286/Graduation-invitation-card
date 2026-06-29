/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, GraduationCap } from 'lucide-react';

export default function Countdown() {
  const targetDate = new Date('2026-07-05T07:30:00').getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isOver: false });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeBlocks = [
    { label: 'Ngày', value: timeLeft.days },
    { label: 'Giờ', value: timeLeft.hours },
    { label: 'Phút', value: timeLeft.minutes },
    { label: 'Giây', value: timeLeft.seconds },
  ];

  return (
    <motion.div
      id="graduation-countdown"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className="w-full bg-[#FCFAF5] rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.08)] p-5 md:p-7 relative border border-[#C5A059]/20 overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent"></div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-full bg-[#002147] text-[#C5A059] flex items-center justify-center shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-[11px] text-[#9A6F12] tracking-[0.22em] uppercase font-black">Đếm Ngược</span>
              <h3 className="font-serif text-xl md:text-2xl font-black text-[#001A3A] uppercase tracking-wider leading-tight">
                Đến Lễ Tốt Nghiệp
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[#334155] font-serif text-[13px] font-semibold">
            <Clock className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>07:30, Chủ Nhật 05/07/2026</span>
          </div>
        </div>

        {timeLeft.isOver ? (
          <div className="rounded-xl border border-[#C5A059]/30 bg-white/70 p-5 text-center">
            <h4 className="font-serif text-xl font-black text-[#001A3A] mb-1">Buổi lễ đang diễn ra</h4>
            <p className="font-serif text-sm font-medium text-[#334155]">Chúc các Tân khoa có một buổi lễ tốt nghiệp rực rỡ và tràn ngập niềm tự hào!</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {timeBlocks.map((block) => (
              <div
                key={block.label}
                id={`countdown-${block.label.toLowerCase()}`}
                className="rounded-lg border border-[#C5A059]/25 bg-white/75 px-2 py-3 md:py-4 text-center shadow-sm"
              >
                <div className="h-8 md:h-10 flex items-center justify-center font-serif text-2xl md:text-3xl font-black tracking-tight text-[#001A3A]">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={block.value}
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -15, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="block"
                    >
                      {block.value.toString().padStart(2, '0')}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <span className="font-serif text-[10px] md:text-xs uppercase tracking-widest text-[#9A6F12] font-black mt-1 block">
                  {block.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
