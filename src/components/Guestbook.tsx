/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CongratsMessage } from '../types';
import { PRESET_MESSAGES } from '../data';
import { MessageSquare, Heart, Sparkles, Send, Award, GraduationCap, Flower2, Scroll, HeartHandshake, UserPlus } from 'lucide-react';

export default function Guestbook() {
  const [messages, setMessages] = useState<CongratsMessage[]>([]);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState<'student' | 'parent' | 'teacher' | 'friend' | 'other'>('student');
  const [sticker, setSticker] = useState<'cap' | 'flowers' | 'medal' | 'scroll' | 'heart'>('cap');
  const [messageText, setMessageText] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [formSuccess, setFormSuccess] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('uet_graduation_guestbook');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        setMessages(PRESET_MESSAGES);
      }
    } else {
      setMessages(PRESET_MESSAGES);
      localStorage.setItem('uet_graduation_guestbook', JSON.stringify(PRESET_MESSAGES));
    }
  }, []);

  const saveMessages = (updated: CongratsMessage[]) => {
    setMessages(updated);
    localStorage.setItem('uet_graduation_guestbook', JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !messageText.trim()) return;

    const newMessage: CongratsMessage = {
      id: `m_${Date.now()}`,
      name: name.trim(),
      relation,
      sticker,
      message: messageText.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
    };

    const updated = [newMessage, ...messages];
    saveMessages(updated);

    // Reset Form
    setName('');
    setMessageText('');
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 3000);
  };

  const handleLike = (id: string) => {
    const updated = messages.map((msg) => {
      if (msg.id === id) {
        return { ...msg, likes: msg.likes + 1 };
      }
      return msg;
    });
    saveMessages(updated);
  };

  const getRelationLabel = (rel: string) => {
    switch (rel) {
      case 'student':
        return { text: 'Tân cử nhân', style: 'bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/30' };
      case 'teacher':
        return { text: 'Thầy Cô Giáo', style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'parent':
        return { text: 'Phụ huynh', style: 'bg-sky-500/10 text-sky-400 border-sky-500/20' };
      case 'friend':
        return { text: 'Bạn bè', style: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' };
      default:
        return { text: 'Khách quý', style: 'bg-slate-500/10 text-slate-300 border-slate-500/20' };
    }
  };

  const getStickerIcon = (st: string) => {
    switch (st) {
      case 'cap':
        return <GraduationCap className="w-8 h-8 text-amber-600" />;
      case 'flowers':
        return <Flower2 className="w-8 h-8 text-rose-500" />;
      case 'medal':
        return <Award className="w-8 h-8 text-yellow-500" />;
      case 'scroll':
        return <Scroll className="w-8 h-8 text-amber-700" />;
      default:
        return <Heart className="w-8 h-8 text-red-500" />;
    }
  };

  const filteredMessages = activeFilter === 'all'
    ? messages
    : messages.filter((msg) => msg.relation === activeFilter);

  return (
    <div id="uet-guestbook-section" className="py-20 px-4 bg-[#01142B] text-white relative">
      <div className="max-w-5xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-sans text-xs tracking-[0.25em] text-[#C5A059] font-bold uppercase block mb-2">Lưu giữ kỷ niệm vàng</span>
          <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-white tracking-wide">
            SỔ VÀNG LƯU BÚT & LỜI CHÚC
          </h2>
          <p className="font-serif text-base text-slate-300 max-w-xl mx-auto mt-3">
            Hãy gửi những lời chúc mừng tốt đẹp nhất, những lời tri ân gửi tới thầy cô, gia đình và bạn bè trong ngày lễ vinh quy bái tổ này.
          </p>
          <div className="w-16 h-[2px] bg-[#C5A059]/40 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* LEFT: Submission Form (5 Cols) */}
          <div className="lg:col-span-5 bg-[#002147] rounded-2xl border border-[#C5A059]/20 p-6 md:p-8 shadow-xl relative">
            <h3 className="font-serif text-xl font-extrabold text-[#C5A059] mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#C5A059]" /> VIẾT LỜI CHÚC MỪNG
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <div>
                <label htmlFor="guestbook-name" className="block font-serif text-sm font-bold text-slate-300 mb-1.5">Tên của bạn *</label>
                <input
                  type="text"
                  id="guestbook-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Minh Anh, Thầy Lê Văn A..."
                  className="w-full bg-[#01142B] border border-[#C5A059]/30 focus:border-[#C5A059] rounded-xl py-2.5 px-4 font-serif outline-none transition-all text-base text-white placeholder-slate-500"
                />
              </div>

              {/* Relation */}
              <div>
                <label className="block font-serif text-sm font-bold text-slate-300 mb-1.5">Bạn là ai? *</label>
                <div className="grid grid-cols-2 gap-2 text-xs font-serif">
                  {[
                    { id: 'student', label: 'Tân cử nhân' },
                    { id: 'teacher', label: 'Thầy/Cô giáo' },
                    { id: 'parent', label: 'Phụ huynh' },
                    { id: 'friend', label: 'Bạn bè' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      id={`relation-btn-${item.id}`}
                      onClick={() => setRelation(item.id as any)}
                      className={`py-2 px-3 rounded-lg border text-left transition-all ${relation === item.id
                          ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059] font-bold'
                          : 'border-slate-850 text-slate-300 hover:bg-[#01142B]/50'
                        }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sticker Selector */}
              <div>
                <label className="block font-serif text-sm font-bold text-slate-300 mb-2">Chọn biểu tượng kèm theo</label>
                <div className="flex gap-4 justify-between bg-[#01142B] border border-[#C5A059]/30 p-3 rounded-xl">
                  {[
                    { id: 'cap', icon: <GraduationCap className="w-5 h-5" />, title: 'Mũ tốt nghiệp' },
                    { id: 'flowers', icon: <Flower2 className="w-5 h-5" />, title: 'Bó hoa' },
                    { id: 'medal', icon: <Award className="w-5 h-5" />, title: 'Huy chương' },
                    { id: 'scroll', icon: <Scroll className="w-5 h-5" />, title: 'Bằng tốt nghiệp' },
                    { id: 'heart', icon: <Heart className="w-5 h-5" />, title: 'Trái tim' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      id={`sticker-btn-${item.id}`}
                      onClick={() => setSticker(item.id as any)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${sticker === item.id
                          ? 'bg-[#C5A059] text-[#002147] scale-110 shadow-md'
                          : 'bg-[#002147] text-slate-400 border border-[#C5A059]/20 hover:text-white'
                        }`}
                      title={item.title}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message text */}
              <div>
                <label htmlFor="guestbook-text" className="block font-serif text-sm font-bold text-slate-300 mb-1.5">Nội dung lời chúc *</label>
                <textarea
                  id="guestbook-text"
                  required
                  rows={4}
                  maxLength={500}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Gửi gắm niềm tự hào, tình cảm và kỷ niệm của bạn..."
                  className="w-full bg-[#01142B] border border-[#C5A059]/30 focus:border-[#C5A059] rounded-xl py-2.5 px-4 font-serif outline-none transition-all text-base text-white resize-none placeholder-slate-500"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                id="btn-submit-guestbook"
                className="w-full bg-[#C5A059] hover:bg-[#B38F46] text-[#002147] font-serif font-bold py-3 px-6 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 text-base uppercase tracking-wider"
              >
                Gửi Lời Chúc Mừng <Send className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {formSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg text-center font-serif"
                  >
                    ✨ Gửi lời chúc thành công! Cảm ơn bạn đã lưu lại kỉ niệm quý giá này.
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* RIGHT: List of Greetings (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 pb-2 border-b border-[#C5A059]/20 font-serif text-sm">
              {[
                { id: 'all', label: 'Tất cả lời chúc' },
                { id: 'student', label: 'Tân cử nhân' },
                { id: 'teacher', label: 'Thầy Cô' },
                { id: 'parent', label: 'Phụ huynh' },
                { id: 'friend', label: 'Bạn bè' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  id={`filter-tab-${tab.id}`}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`py-1.5 px-3.5 rounded-full transition-all border ${activeFilter === tab.id
                      ? 'bg-[#C5A059] border-[#C5A059] text-[#002147] font-semibold shadow-sm'
                      : 'bg-[#002147]/60 border-slate-800 text-slate-300 hover:bg-[#002147]'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Scrolling list */}
            <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((msg) => {
                    const badge = getRelationLabel(msg.relation);
                    return (
                      <motion.div
                        key={msg.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-[#002147] border border-[#C5A059]/20 rounded-xl p-5 shadow-xl hover:border-[#C5A059]/40 transition-all relative flex gap-4"
                      >
                        {/* Custom Sticker badge */}
                        <div className="shrink-0 flex items-start mt-1">
                          <div className="w-12 h-12 rounded-full bg-[#01142B] border border-[#C5A059]/30 flex items-center justify-center shadow-inner">
                            {getStickerIcon(msg.sticker)}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-serif font-bold text-white text-base">{msg.name}</h4>
                              <span className={`text-[10px] font-sans font-bold uppercase px-2 py-0.5 rounded border ${badge.style}`}>
                                {badge.text}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">
                              {new Date(msg.timestamp).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>

                          <p className="font-serif text-sm text-slate-200 leading-relaxed italic whitespace-pre-wrap">
                            "{msg.message}"
                          </p>

                          {/* Like Action */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-800 mt-2">
                            <span className="font-serif text-xs text-[#C5A059]/70">Trường ĐH Công nghệ - ĐHQGHN</span>
                            <button
                              id={`like-btn-${msg.id}`}
                              onClick={() => handleLike(msg.id)}
                              className="flex items-center gap-1.5 text-xs font-serif text-slate-400 hover:text-rose-500 transition-colors group"
                            >
                              <Heart className="w-3.5 h-3.5 group-hover:scale-125 transition-transform group-hover:fill-rose-500" />
                              <span>Thích ({msg.likes})</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="bg-[#002147]/50 border border-dashed border-[#C5A059]/20 rounded-xl p-8 text-center text-slate-400 font-serif text-sm">
                    Không tìm thấy lời chúc nào trong danh mục này. Hãy viết lời chúc đầu tiên của bạn!
                  </div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
