/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { SCHEDULE_DATA } from '../data';
import { Clock, Award, Star, BookOpen, Music, ShieldAlert } from 'lucide-react';

export default function Schedule() {
  const [activeItem, setActiveItem] = useState<number | null>(null);

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'formal':
        return (
          <span className="bg-[#002147] text-sky-300 border border-sky-400/30 text-[11px] font-sans font-semibold uppercase px-2.5 py-0.5 rounded-full tracking-wider flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-sky-400" /> Nghi lễ
          </span>
        );
      case 'academic':
        return (
          <span className="bg-[#002147] text-[#C5A059] border border-[#C5A059]/40 text-[11px] font-sans font-semibold uppercase px-2.5 py-0.5 rounded-full tracking-wider flex items-center gap-1">
            <Award className="w-3 h-3 text-[#C5A059]" /> Học thuật
          </span>
        );
      case 'celebration':
        return (
          <span className="bg-[#002147] text-emerald-400 border border-emerald-400/30 text-[11px] font-sans font-semibold uppercase px-2.5 py-0.5 rounded-full tracking-wider flex items-center gap-1">
            <Music className="w-3 h-3 text-emerald-400" /> Chúc mừng
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div id="uet-schedule-section" className="py-20 px-4 bg-[#002147] text-white relative">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#C5A059] via-[#002147] to-[#C5A059]/60 opacity-40"></div>

      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-sans text-xs tracking-[0.25em] text-[#C5A059] font-bold uppercase block mb-2">Chương trình buổi lễ</span>
          <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-white tracking-wide">
            LỊCH TRÌNH CHI TIẾT
          </h2>
          <p className="font-serif text-base text-slate-300 max-w-xl mx-auto mt-3">
            Thông tin chi tiết khung thời gian diễn ra các hoạt động lễ tốt nghiệp ngày 05/07/2026 tại Hội trường Nguyễn Văn Đạo.
          </p>
          <div className="w-16 h-[2px] bg-[#C5A059]/40 mx-auto mt-6"></div>
        </div>

        {/* Vertical Timeline */}
        <div className="relative border-l border-[#C5A059]/20 ml-4 md:ml-40 pl-6 md:pl-8 space-y-12">
          {SCHEDULE_DATA.map((item, index) => {
            const isExpanded = activeItem === index;

            return (
              <motion.div
                key={index}
                id={`schedule-item-${index}`}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                {/* Timeline Node Point */}
                <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#002147] border-2 border-[#C5A059] group-hover:bg-[#C5A059] group-hover:border-[#C5A059] transition-colors z-10 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] group-hover:bg-[#002147]"></div>
                </div>

                {/* Left Side Time Tag (Desktop Only) */}
                <div className="hidden md:block absolute -left-48 w-36 text-right top-1">
                  <span className="font-sans text-xs tracking-widest text-[#C5A059] font-bold uppercase block">
                    {item.time.split('–')[0].trim()}
                  </span>
                  <span className="font-serif text-xs text-slate-400 mt-1 block">
                    {item.time.split('–')[1] ? `đến ${item.time.split('–')[1].trim()}` : ''}
                  </span>
                </div>

                {/* Main Content Box */}
                <div 
                  onClick={() => setActiveItem(isExpanded ? null : index)}
                  className={`cursor-pointer rounded-xl border p-5 md:p-6 transition-all duration-300 ${
                    isExpanded 
                      ? 'bg-[#C5A059]/10 border-[#C5A059] shadow-lg shadow-black/30' 
                      : 'bg-[#01142B] border-[#C5A059]/15 hover:bg-white/5 hover:border-[#C5A059]/30'
                  }`}
                >
                  {/* Title Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-col">
                      {/* Time Tag (Mobile Only) */}
                      <span className="font-sans text-xs font-bold text-[#C5A059] md:hidden tracking-wider mb-1 block">
                        {item.time}
                      </span>
                      <h4 className="font-serif text-lg md:text-xl font-bold text-white group-hover:text-[#C5A059] transition-colors">
                        {item.activity}
                      </h4>
                    </div>

                    <div className="self-start sm:self-center shrink-0">
                      {getCategoryBadge(item.category)}
                    </div>
                  </div>

                  {/* Description / Expanded Details */}
                  <div className="mt-3">
                    <p className="font-serif text-sm text-slate-200 leading-relaxed">
                      {item.details}
                    </p>
                  </div>

                  {/* Interactive hint on hover */}
                  <div className="mt-4 pt-3 border-t border-dashed border-[#C5A059]/10 flex items-center justify-between text-xs font-serif text-slate-400 italic">
                    <span>Đại học Quốc gia Hà Nội</span>
                    <span className="text-[10px] uppercase font-sans tracking-widest text-slate-400/80">QH-2022</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Important Guidelines Notice Card */}
        <div className="mt-16 bg-gradient-to-br from-[#01142B] to-[#002147] text-white rounded-xl p-6 md:p-8 relative overflow-hidden shadow-xl border border-[#C5A059]/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <h4 className="font-serif text-lg font-bold text-[#C5A059] mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> Lưu ý quan trọng dành cho Tân cử nhân & Quý phụ huynh
          </h4>
          <ul className="space-y-2 font-serif text-sm text-slate-200 list-disc list-inside">
            <li><strong>Lễ phục tốt nghiệp:</strong> Sinh viên nhận lễ phục trực tiếp tại văn phòng Khoa quản lý từ ngày 01/07 đến trước 17:00 ngày 04/07/2026.</li>
            <li><strong>Giờ tập trung:</strong> Có mặt tại Hội trường Nguyễn Văn Đạo đúng 07:15 để ổn định chỗ ngồi theo sơ đồ khối ngành.</li>
            <li><strong>Trang phục khách mời:</strong> Trang phục lịch sự, trang trọng. Khách mời vui lòng mang theo thiệp mời điện tử hoặc bản giấy để ban tổ chức đón tiếp thuận tiện nhất.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
