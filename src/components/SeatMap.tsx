/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_SEATS } from '../data';
import { StudentSeat } from '../types';
import { Search, MapPin, Navigation, Info, Users, MonitorPlay, Train, Bus, Compass } from 'lucide-react';

export default function SeatMap() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<StudentSeat | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    
    const found = MOCK_SEATS.find(
      (seat) =>
        seat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seat.studentId.includes(searchTerm)
    );
    
    setSearchResult(found || null);
    if (found) {
      setSelectedBlock(found.block);
    } else {
      setSelectedBlock(null);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResult(null);
    setHasSearched(false);
    setSelectedBlock(null);
  };

  // Blocks present in Hội trường Nguyễn Văn Đạo layout
  const blocks = [
    { id: 'Khu vực A (Cận sân khấu)', name: 'Khối Cận Sân Khấu (Khu A)', desc: 'Dành cho Thủ khoa, sinh viên xuất sắc & Ban giám hiệu', color: 'bg-amber-500' },
    { id: 'Khu vực B (Trung tâm)', name: 'Khối Trung Tâm (Khu B)', desc: 'Dành cho Tân cử nhân các khoa Công nghệ Thông tin, Hệ thống Thông tin', color: 'bg-[#0B2F64]' },
    { id: 'Khu vực C (Cánh trái)', name: 'Khánh tiết Cánh Trái (Khu C)', desc: 'Dành cho Tân cử nhân ngành Điện tử Viễn thông, Robot, Kỹ thuật Máy tính', color: 'bg-indigo-600' },
    { id: 'Khu vực D (Cánh phải)', name: 'Khánh tiết Cánh Phải (Khu D)', desc: 'Dành cho Tân cử nhân ngành Vật lý Kỹ thuật, Công nghệ Hàng không Vũ trụ', color: 'bg-sky-600' },
    { id: 'Khu vực E (Khán đài tầng 2)', name: 'Khán đài Tầng 2 (Khu E)', desc: 'Dành cho Quý phụ huynh và Khách mời tự do', color: 'bg-slate-600' },
  ];

  return (
    <div id="uet-location-section" className="py-20 px-4 bg-[#01142B] text-white relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-sans text-xs tracking-[0.25em] text-[#C5A059] font-bold uppercase block mb-2">Vị trí & Bản đồ chỗ ngồi</span>
          <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-white tracking-wide">
            HỘI TRƯỜNG NGUYỄN VĂN ĐẠO
          </h2>
          <p className="font-serif text-base text-slate-300 max-w-xl mx-auto mt-3">
            Hội trường lớn Nguyễn Văn Đạo nằm trong khuôn viên Đại học Quốc gia Hà Nội - 144 Xuân Thuỷ, Cầu Giấy, Hà Nội.
          </p>
          <div className="w-16 h-[2px] bg-[#C5A059]/40 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: Search Seat & Seating Guide (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#002147] rounded-2xl border border-[#C5A059]/20 p-6 md:p-8 shadow-xl">
              <h3 className="font-serif text-xl font-extrabold text-[#C5A059] mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#C5A059]" /> TÌM CHỖ NGỒI TÂN CỬ NHÂN
              </h3>
              <p className="font-serif text-sm text-slate-300 mb-6">
                Nhập Họ tên hoặc Mã số sinh viên của bạn để tra cứu chính xác khu vực, hàng ghế và số ghế trong hội trường.
              </p>

              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    required
                    id="seat-search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ví dụ: Minh Anh, Thảo hoặc 22020101..."
                    className="w-full bg-[#01142B] border border-[#C5A059]/30 focus:border-[#C5A059] text-white rounded-xl py-3 px-4 font-serif outline-none transition-all pr-12 text-base placeholder-slate-500"
                  />
                  <button
                    type="submit"
                    id="btn-search-seat"
                    className="absolute right-3 top-2.5 p-1 text-[#C5A059] hover:text-white transition-colors"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    id="btn-submit-search"
                    className="flex-1 bg-[#C5A059] hover:bg-[#B38F46] text-[#002147] font-serif font-bold py-2.5 px-4 rounded-lg transition-colors text-sm uppercase tracking-wider"
                  >
                    Tra Cứu Chỗ Ngồi
                  </button>
                  {hasSearched && (
                    <button
                      type="button"
                      id="btn-clear-search"
                      onClick={clearSearch}
                      className="bg-[#01142B] hover:bg-slate-800 text-slate-300 border border-[#C5A059]/25 font-serif font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm"
                    >
                      Xóa tìm kiếm
                    </button>
                  )}
                </div>
              </form>

              {/* Search Result Card Display */}
              <AnimatePresence mode="wait">
                {hasSearched && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="mt-6 border-t border-[#C5A059]/20 pt-6"
                  >
                    {searchResult ? (
                      /* Found Card resembling a Boarding Pass */
                      <div className="bg-gradient-to-br from-[#01142B] to-[#002147] border border-[#C5A059]/30 rounded-xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A059]/5 rounded-full pointer-events-none"></div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-sans text-[10px] tracking-widest text-[#C5A059] font-extrabold uppercase">Thẻ thông tin chỗ ngồi</span>
                          <span className="bg-[#C5A059] text-[#002147] text-[10px] font-sans font-bold px-2 py-0.5 rounded uppercase">QH-2022</span>
                        </div>

                        <h4 className="font-serif text-lg font-bold text-[#C5A059]">{searchResult.name}</h4>
                        <p className="font-serif text-xs text-slate-300">Mã sinh viên: {searchResult.studentId}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4 border-t border-[#C5A059]/10 pt-4 text-sm font-serif">
                          <div>
                            <span className="text-xs text-slate-400 block">Ngành học</span>
                            <span className="font-semibold text-slate-200">{searchResult.major}</span>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400 block">Khu vực chỗ ngồi</span>
                            <span className="font-semibold text-[#C5A059]">{searchResult.block}</span>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400 block">Hàng ghế</span>
                            <span className="font-bold text-slate-200">{searchResult.row}</span>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400 block">Số ghế</span>
                            <span className="font-extrabold text-[#C5A059] text-base">{searchResult.seatNumber}</span>
                          </div>
                        </div>

                        <p className="mt-4 text-[11px] font-serif text-[#C5A059]/80 italic flex items-center gap-1">
                          <Info className="w-3 h-3 shrink-0" /> Chỗ ngồi này được đánh dấu màu nổi bật trên bản đồ bên phải.
                        </p>
                      </div>
                    ) : (
                      /* Not Found State */
                      <div className="bg-[#01142B] border border-[#C5A059]/20 rounded-xl p-4 text-center">
                        <p className="font-serif text-sm text-slate-300">
                          Không tìm thấy Tân cử nhân có tên hoặc MSSV tương ứng.
                        </p>
                        <p className="font-serif text-xs text-slate-400 mt-2 leading-relaxed">
                          Lưu ý: Hệ thống đang chứa danh sách mẫu tiêu biểu của K67. Quý phụ huynh vui lòng ngồi tại <strong className="text-slate-300">Khu vực E (Khán đài tầng 2)</strong>.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Travel Directions card */}
            <div className="bg-[#002147] rounded-2xl border border-[#C5A059]/20 p-6 md:p-8 shadow-xl">
              <h3 className="font-serif text-base font-extrabold text-[#C5A059] mb-4 flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#C5A059]" /> CHỈ ĐƯỜNG & DI CHUYỂN
              </h3>
              
              <div className="space-y-4 font-serif text-sm">
                <div className="flex gap-3">
                  <Train className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white">Tàu điện trên cao (Metro Nhổn - Ga Hà Nội)</h5>
                    <p className="text-slate-300 text-xs mt-0.5">Xuống tại <strong>Ga Chùa Hà</strong> hoặc <strong>Ga Đại học Quốc gia Hà Nội</strong>, sau đó đi bộ 100m vào cổng chính 144 Xuân Thủy.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Bus className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white">Xe buýt công cộng</h5>
                    <p className="text-slate-300 text-xs mt-0.5">Các tuyến dừng tại điểm đối diện cổng ĐHQGHN: <strong>16, 20A, 26, 27, 32, 34, 49</strong>.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white">Gửi xe cá nhân</h5>
                    <p className="text-slate-300 text-xs mt-0.5">Gửi xe máy tại hầm nhà C1T, gửi ô tô xung quanh quảng trường hoặc hầm tòa nhà Diamond Flower đối diện.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Floor Map Visualization & Location Map (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Interactive Visual Floor Layout of Hall */}
            <div className="bg-[#002147] rounded-2xl border border-[#C5A059]/20 p-6 shadow-xl">
              <h4 className="font-serif text-base font-extrabold text-white mb-4 flex items-center gap-2">
                <MonitorPlay className="w-5 h-5 text-[#C5A059]" /> SƠ ĐỒ HỘI TRƯỜNG NGUYỄN VĂN ĐẠO
              </h4>

              {/* Sân Khấu (Stage) Indicator */}
              <div className="w-full bg-[#01142B] text-[#C5A059] text-center py-3.5 rounded-lg font-serif font-bold text-sm tracking-widest shadow-inner border border-[#C5A059]/20 mb-8 uppercase">
                SÂN KHẤU CHÍNH (STAGE)
              </div>

              {/* Seating Grid Blocks */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                
                {/* Block A (Top Left Center) */}
                <div 
                  onClick={() => setSelectedBlock('Khu vực A (Cận sân khấu)')}
                  className={`border-2 rounded-xl p-4 transition-all cursor-pointer text-center relative overflow-hidden ${
                    selectedBlock === 'Khu vực A (Cận sân khấu)'
                      ? 'border-[#C5A059] bg-[#C5A059]/15 shadow-lg'
                      : 'border-slate-800 bg-[#01142B] hover:bg-[#002147] hover:border-[#C5A059]/30'
                  }`}
                >
                  <span className="absolute top-1 right-2 font-sans text-[10px] text-[#C5A059] font-extrabold">KHU A</span>
                  <h5 className="font-serif font-bold text-white text-sm">Cận Sân Khấu</h5>
                  <p className="font-serif text-[11px] text-slate-400 mt-1">QH-2022 Tiêu Biểu & Khách Mời VIP</p>
                  <div className="mt-2.5 flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className={`w-2.5 h-2.5 rounded-sm ${selectedBlock === 'Khu vực A (Cận sân khấu)' ? 'bg-[#C5A059] animate-pulse' : 'bg-slate-700'}`}></span>
                    ))}
                  </div>
                </div>

                {/* Block B (Top Right Center) */}
                <div 
                  onClick={() => setSelectedBlock('Khu vực B (Trung tâm)')}
                  className={`border-2 rounded-xl p-4 transition-all cursor-pointer text-center relative overflow-hidden ${
                    selectedBlock === 'Khu vực B (Trung tâm)'
                      ? 'border-[#C5A059] bg-[#C5A059]/15 shadow-lg'
                      : 'border-slate-800 bg-[#01142B] hover:bg-[#002147] hover:border-[#C5A059]/30'
                  }`}
                >
                  <span className="absolute top-1 right-2 font-sans text-[10px] text-[#C5A059] font-extrabold">KHU B</span>
                  <h5 className="font-serif font-bold text-white text-sm">Trung Tâm Chính</h5>
                  <p className="font-serif text-[11px] text-slate-400 mt-1">Tân cử nhân Công nghệ Thông tin</p>
                  <div className="mt-2.5 flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className={`w-2.5 h-2.5 rounded-sm ${selectedBlock === 'Khu vực B (Trung tâm)' ? 'bg-[#C5A059] animate-pulse' : 'bg-slate-700'}`}></span>
                    ))}
                  </div>
                </div>

                {/* Block C (Left Wing) */}
                <div 
                  onClick={() => setSelectedBlock('Khu vực C (Cánh trái)')}
                  className={`border-2 rounded-xl p-4 transition-all cursor-pointer text-center relative overflow-hidden ${
                    selectedBlock === 'Khu vực C (Cánh trái)'
                      ? 'border-[#C5A059] bg-[#C5A059]/15 shadow-lg'
                      : 'border-slate-800 bg-[#01142B] hover:bg-[#002147] hover:border-[#C5A059]/30'
                  }`}
                >
                  <span className="absolute top-1 right-2 font-sans text-[10px] text-[#C5A059] font-extrabold">KHU C</span>
                  <h5 className="font-serif font-bold text-white text-sm">Khối Cánh Trái</h5>
                  <p className="font-serif text-[11px] text-slate-400 mt-1">ĐTVT, Robot, Kỹ thuật Máy tính</p>
                  <div className="mt-2.5 flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className={`w-2.5 h-2.5 rounded-sm ${selectedBlock === 'Khu vực C (Cánh trái)' ? 'bg-[#C5A059] animate-pulse' : 'bg-slate-700'}`}></span>
                    ))}
                  </div>
                </div>

                {/* Block D (Right Wing) */}
                <div 
                  onClick={() => setSelectedBlock('Khu vực D (Cánh phải)')}
                  className={`border-2 rounded-xl p-4 transition-all cursor-pointer text-center relative overflow-hidden ${
                    selectedBlock === 'Khu vực D (Cánh phải)'
                      ? 'border-[#C5A059] bg-[#C5A059]/15 shadow-lg'
                      : 'border-slate-800 bg-[#01142B] hover:bg-[#002147] hover:border-[#C5A059]/30'
                  }`}
                >
                  <span className="absolute top-1 right-2 font-sans text-[10px] text-[#C5A059] font-extrabold">KHU D</span>
                  <h5 className="font-serif font-bold text-white text-sm">Khối Cánh Phải</h5>
                  <p className="font-serif text-[11px] text-slate-400 mt-1">Vật lý, Hàng không vũ trụ, Nông nghiệp</p>
                  <div className="mt-2.5 flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className={`w-2.5 h-2.5 rounded-sm ${selectedBlock === 'Khu vực D (Cánh phải)' ? 'bg-[#C5A059] animate-pulse' : 'bg-slate-700'}`}></span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Block E parent seating (At the bottom of map representing 2nd floor balcony) */}
              <div 
                onClick={() => setSelectedBlock('Khu vực E (Khán đài tầng 2)')}
                className={`border-2 rounded-xl p-4 transition-all cursor-pointer text-center relative overflow-hidden ${
                  selectedBlock === 'Khu vực E (Khán đài tầng 2)'
                    ? 'border-[#C5A059] bg-[#C5A059]/15 shadow-lg'
                    : 'border-slate-800 bg-[#01142B] hover:bg-[#002147] hover:border-[#C5A059]/30'
                }`}
              >
                <span className="absolute top-1 right-4 font-sans text-[10px] text-[#C5A059] font-extrabold">TẦNG 2 (KHU E)</span>
                <h5 className="font-serif font-bold text-white text-sm">Khán Đài Tầng 2 (Lối vào phía sau)</h5>
                <p className="font-serif text-[11px] text-slate-400 mt-1">Khu vực ưu tiên dành riêng cho Quý phụ huynh & Khách mời tham gia tự do</p>
                <div className="mt-2 flex justify-center gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                    <span key={s} className={`w-2 h-2 rounded-sm ${selectedBlock === 'Khu vực E (Khán đài tầng 2)' ? 'bg-[#C5A059] animate-pulse' : 'bg-slate-700'}`}></span>
                  ))}
                </div>
              </div>

              {/* Map block details display description based on clicked block */}
              <div className="mt-4 bg-[#01142B] border border-[#C5A059]/20 rounded-xl p-4 text-center">
                {selectedBlock ? (
                  <div>
                    <h5 className="font-serif font-bold text-[#C5A059] text-sm">
                      {blocks.find((b) => b.id === selectedBlock)?.name}
                    </h5>
                    <p className="font-serif text-xs text-slate-300 mt-1">
                      {blocks.find((b) => b.id === selectedBlock)?.desc}
                    </p>
                  </div>
                ) : (
                  <p className="font-serif text-xs text-slate-400 italic">
                    * Nhấp chọn một khu vực bất kỳ trên sơ đồ để xem thông tin chi tiết.
                  </p>
                )}
              </div>
            </div>

            {/* Embedded maps or directions helper */}
            <div className="bg-[#002147] rounded-2xl border border-[#C5A059]/20 p-6 shadow-xl overflow-hidden">
              <h4 className="font-serif text-base font-extrabold text-white mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-[#C5A059]" /> BẢN ĐỒ VỊ TRÍ (144 XUÂN THỦY)
              </h4>

              {/* Embedded Iframe of Google Maps */}
              <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-800 relative bg-[#01142B]">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.863855881423!2d105.78010377508119!3d21.038132780613524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab354920c233%3A0x5d0313a3ee313e93!2zSOG7mWkgdHLGsOG7nW5nIE5ndXnhu4VuIFbEg24gxJDhuqFv!5e0!3m2!1svi!2s!4v1719600000000!5m2!1svi!2s" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hội trường Nguyễn Văn Đạo Google Map"
                  className="absolute inset-0"
                ></iframe>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs font-serif text-slate-400">
                <span>VNU Nguyễn Văn Đạo Hall - 144 Xuân Thủy, Cầu Giấy, Hà Nội</span>
                <a 
                  href="https://maps.app.goo.gl/9R6D69Fz4955bEaV9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#C5A059] hover:underline font-bold"
                >
                  Mở Google Maps ↗
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
