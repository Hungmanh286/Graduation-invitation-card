/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, ChangeEvent, MouseEvent, TouchEvent } from 'react';
import { motion } from 'motion/react';
import { Camera, Upload, RotateCw, ZoomIn, ZoomOut, Download, Sparkles, Award, RefreshCw } from 'lucide-react';

interface FrameTemplate {
  id: string;
  name: string;
  theme: string;
  bgColor: string;
  borderColor: string;
  overlayText: string;
  subText: string;
  accentColor: string;
}

export default function PhotoBooth() {
  const [selectedFrame, setSelectedFrame] = useState<string>('frame1');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [rotate, setRotate] = useState<number>(0);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const frames: FrameTemplate[] = [
    {
      id: 'frame1',
      name: 'Khung Hoàng Gia UET',
      theme: 'Navy & Gold Classic',
      bgColor: 'bg-[#002147]',
      borderColor: 'border-[#C5A059]',
      overlayText: 'LỄ TỐT NGHIỆP QH-2022',
      subText: 'Trường Đại học Công nghệ - ĐHQGHN',
      accentColor: '#C5A059',
    },
    {
      id: 'frame2',
      name: 'Khung Vinh Danh Thủ Khoa',
      theme: 'Golden Laurel Academic',
      bgColor: 'bg-stone-900',
      borderColor: 'border-yellow-400',
      overlayText: 'TÂN KHOA ƯU TÚ UET 2026',
      subText: 'Sáng tạo - Tiên phong - Trách nhiệm xã hội',
      accentColor: '#FFD700',
    },
    {
      id: 'frame3',
      name: 'Khung Trẻ Trung K67',
      theme: 'Modern Cyan & Gold Tech',
      bgColor: 'bg-[#01142B]',
      borderColor: 'border-[#C5A059]',
      overlayText: 'TỰ HÀO K67 CÔNG NGHỆ',
      subText: 'Khát vọng bay xa - Kiến tạo tương lai',
      accentColor: '#C5A059',
    },
    {
      id: 'frame4',
      name: 'Khung Khách Quý Của Mạnh Hùng',
      theme: 'Graduation Guest of Hùng',
      bgColor: 'bg-[#002147]',
      borderColor: 'border-[#C5A059]',
      overlayText: 'CHÚC MỪNG CỬ NHÂN MẠNH HÙNG',
      subText: 'Đồng hành cùng Nguyễn Mạnh Hùng - UET 2026',
      accentColor: '#C5A059',
    },
  ];

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
          // Reset controls
          setZoom(1);
          setRotate(0);
          setOffsetX(0);
          setOffsetY(0);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Drag and drop / Pan support
  const handleMouseDown = (e: MouseEvent) => {
    if (!imageSrc) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - offsetX, y: e.clientY - offsetY });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !imageSrc) return;
    setOffsetX(e.clientX - dragStart.x);
    setOffsetY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Support
  const handleTouchStart = (e: TouchEvent) => {
    if (!imageSrc) return;
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX - offsetX, y: touch.clientY - offsetY });
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !imageSrc) return;
    const touch = e.touches[0];
    setOffsetX(touch.clientX - dragStart.x);
    setOffsetY(touch.clientY - dragStart.y);
  };

  const resetBooth = () => {
    setImageSrc(null);
    setZoom(1);
    setRotate(0);
    setOffsetX(0);
    setOffsetY(0);
  };

  // Export composite image using HTML5 Canvas
  const handleDownload = () => {
    if (!imageSrc) return;
    setIsGenerating(true);

    const canvas = canvasRef.current;
    if (!canvas) {
      setIsGenerating(false);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsGenerating(false);
      return;
    }

    const currentFrame = frames.find((f) => f.id === selectedFrame) || frames[0];

    // Load user photo and overlay them onto standard canvas sizes (e.g. 1000x1000 high res)
    const userImg = new Image();
    userImg.src = imageSrc;

    userImg.onload = () => {
      const size = 1000;
      canvas.width = size;
      canvas.height = size;

      // Clear Canvas
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size, size);

      // Save Context state to draw User image with transform
      ctx.save();
      
      // Center of user image drawing area inside frame (margins for border)
      const borderSize = 100; // 100px padding around user image
      const drawSize = size - borderSize * 2;
      const centerX = size / 2;
      const centerY = size / 2;

      ctx.translate(centerX + offsetX, centerY + offsetY);
      ctx.rotate((rotate * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      // Aspect ratio crop calculation
      const imgWidth = userImg.width;
      const imgHeight = userImg.height;
      const ratio = Math.max(drawSize / imgWidth, drawSize / imgHeight);
      const w = imgWidth * ratio;
      const h = imgHeight * ratio;

      ctx.drawImage(userImg, -w / 2, -h / 2, w, h);
      ctx.restore();

      // DRAW OVERLAY FRAME
      // Outer Navy solid border
      ctx.fillStyle = (currentFrame.id === 'frame1' || currentFrame.id === 'frame4') ? '#002147' : currentFrame.id === 'frame2' ? '#1C1917' : '#01142B';
      
      // Draw outer thick frame border
      const fWidth = 65; // Frame border thickness
      ctx.fillRect(0, 0, size, fWidth); // Top
      ctx.fillRect(0, size - fWidth - 40, size, fWidth + 40); // Bottom is thicker for text
      ctx.fillRect(0, 0, fWidth, size); // Left
      ctx.fillRect(size - fWidth, 0, fWidth, size); // Right

      // Draw elegant double golden frame lines
      ctx.strokeStyle = currentFrame.accentColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(fWidth + 10, fWidth + 10, size - (fWidth + 10) * 2, size - (fWidth + 10) * 2 - 40);

      ctx.lineWidth = 1.5;
      ctx.strokeRect(fWidth + 20, fWidth + 20, size - (fWidth + 20) * 2, size - (fWidth + 20) * 2 - 40);

      // Drawing Corner Decorative Ornaments
      const cornerSize = 40;
      ctx.lineWidth = 3;
      // Top Left corner lines
      ctx.beginPath();
      ctx.moveTo(fWidth + 30, fWidth + 30 + cornerSize);
      ctx.lineTo(fWidth + 30, fWidth + 30);
      ctx.lineTo(fWidth + 30 + cornerSize, fWidth + 30);
      ctx.stroke();

      // Top Right corner lines
      ctx.beginPath();
      ctx.moveTo(size - fWidth - 30 - cornerSize, fWidth + 30);
      ctx.lineTo(size - fWidth - 30, fWidth + 30);
      ctx.lineTo(size - fWidth - 30, fWidth + 30 + cornerSize);
      ctx.stroke();

      // Bottom Left corner lines
      ctx.beginPath();
      ctx.moveTo(fWidth + 30, size - fWidth - 70 - cornerSize);
      ctx.lineTo(fWidth + 30, size - fWidth - 70);
      ctx.lineTo(fWidth + 30 + cornerSize, size - fWidth - 70);
      ctx.stroke();

      // Bottom Right corner lines
      ctx.beginPath();
      ctx.moveTo(size - fWidth - 30 - cornerSize, size - fWidth - 70);
      ctx.lineTo(size - fWidth - 30, size - fWidth - 70);
      ctx.lineTo(size - fWidth - 30, size - fWidth - 70 - cornerSize);
      ctx.stroke();

      // Draw School Logo / Emblem on Frame
      ctx.beginPath();
      ctx.arc(size / 2, fWidth + 30, 45, 0, Math.PI * 2);
      ctx.fillStyle = '#002147';
      ctx.fill();
      ctx.strokeStyle = currentFrame.accentColor;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 32px Times New Roman';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('UET', size / 2, fWidth + 30);

      // Draw Primary Bold Title (Text Bottom)
      ctx.fillStyle = currentFrame.accentColor;
      ctx.font = 'bold 42px Times New Roman';
      ctx.fillText(currentFrame.overlayText, size / 2, size - fWidth - 10);

      // Draw Secondary Subtitle (Text Bottom)
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'italic 24px Times New Roman';
      ctx.fillText(currentFrame.subText, size / 2, size - 35);

      // Trigger standard browser download
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.download = `UET_Graduation_Photo_${Date.now()}.jpg`;
      link.href = dataUrl;
      link.click();

      setIsGenerating(false);
    };

    userImg.onerror = () => {
      setIsGenerating(false);
    };
  };

  const activeFrame = frames.find((f) => f.id === selectedFrame) || frames[0];

  return (
    <div id="uet-photobooth-section" className="py-20 px-4 bg-[#002147] text-white relative overflow-hidden border-t border-b border-[#C5A059]/20">
      {/* Visual top border dividing sections */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-[#C5A059]/10"></div>

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-sans text-xs tracking-[0.25em] text-[#C5A059] font-bold uppercase block mb-2">Lưu giữ khoảnh khắc vinh quy</span>
          <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-white tracking-wide">
            KHUNG HÌNH KỶ NIỆM UET
          </h2>
          <p className="font-serif text-base text-slate-300 max-w-xl mx-auto mt-3">
            Tự hào khoác lên mình khung ảnh danh giá của Trường Đại học Công nghệ. Tải ảnh của bạn lên, căn chỉnh và lưu lại tấm hình tuyệt vời nhất.
          </p>
          <div className="w-16 h-[2px] bg-[#C5A059]/40 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT: Frame Selector & Controls (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#01142B] border border-[#C5A059]/20 rounded-2xl p-6 shadow-xl">
              <h3 className="font-serif text-lg font-bold text-[#C5A059] mb-4 flex items-center gap-1.5">
                <Award className="w-5 h-5 text-[#C5A059]" /> BƯỚC 1: CHỌN MẪU KHUNG HÌNH
              </h3>

              {/* Frames Radio selectors */}
              <div className="space-y-3">
                {frames.map((frame) => (
                  <button
                    key={frame.id}
                    id={`frame-selector-${frame.id}`}
                    onClick={() => setSelectedFrame(frame.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                      selectedFrame === frame.id 
                        ? 'border-[#C5A059] bg-[#C5A059]/10 shadow-sm' 
                        : 'border-slate-800 bg-[#002147] hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <h4 className="font-serif font-bold text-white text-sm">{frame.name}</h4>
                      <p className="font-serif text-xs text-slate-400 mt-0.5">{frame.theme}</p>
                    </div>
                    <span 
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center border-slate-700"
                    >
                      {selectedFrame === frame.id && <span className="w-2 h-2 rounded-full bg-[#C5A059]"></span>}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Editing Controls */}
            {imageSrc && (
              <div className="bg-[#01142B] border border-[#C5A059]/20 rounded-2xl p-6 shadow-xl space-y-5">
                <h3 className="font-serif text-lg font-bold text-[#C5A059] flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-[#C5A059]" /> BƯỚC 2: CĂN CHỈNH ẢNH CỦA BẠN
                </h3>
                
                <p className="font-serif text-xs text-slate-400">
                  * Kéo trực tiếp trên bức ảnh bên phải để di chuyển vị trí, hoặc sử dụng các nút căn chỉnh dưới đây.
                </p>

                {/* Zoom Control sliders */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-serif text-slate-300">
                    <span>Phóng to / Thu nhỏ</span>
                    <span className="font-bold text-[#C5A059]">{Math.round(zoom * 100)}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      id="btn-zoom-out"
                      onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                      className="p-1.5 bg-[#002147] border border-[#C5A059]/20 rounded-lg text-slate-300 hover:bg-[#C5A059]/10 transition-colors"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.05"
                      id="zoom-slider"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="flex-1 accent-[#C5A059]"
                    />
                    <button 
                      id="btn-zoom-in"
                      onClick={() => setZoom(Math.min(3.0, zoom + 0.1))}
                      className="p-1.5 bg-[#002147] border border-[#C5A059]/20 rounded-lg text-slate-300 hover:bg-[#C5A059]/10 transition-colors"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Rotation Control */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-serif text-slate-300">
                    <span>Xoay ảnh</span>
                    <span className="font-bold text-[#C5A059]">{rotate}°</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      id="btn-rotate-ccw"
                      onClick={() => setRotate((rotate - 90 + 360) % 360)}
                      className="flex-1 bg-[#002147] border border-[#C5A059]/20 text-slate-200 font-serif font-semibold text-xs py-2 px-3 rounded-lg hover:bg-[#C5A059]/10 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <RotateCw className="w-3.5 h-3.5 rotate-180" /> Xoay trái 90°
                    </button>
                    <button 
                      id="btn-rotate-cw"
                      onClick={() => setRotate((rotate + 90) % 360)}
                      className="flex-1 bg-[#002147] border border-[#C5A059]/20 text-slate-200 font-serif font-semibold text-xs py-2 px-3 rounded-lg hover:bg-[#C5A059]/10 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <RotateCw className="w-3.5 h-3.5" /> Xoay phải 90°
                    </button>
                  </div>
                </div>

                {/* Reset Photo */}
                <button
                  type="button"
                  id="btn-reset-booth"
                  onClick={resetBooth}
                  className="w-full bg-[#002147] border border-[#C5A059]/20 hover:bg-slate-800 text-slate-300 font-serif font-semibold py-2 px-4 rounded-lg transition-colors text-xs flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Đổi ảnh khác
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: Visual Interactive Canvas Preview Box (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            {/* The live DOM representation of the frame */}
            <div 
              ref={previewContainerRef}
              className="w-full max-w-sm aspect-square bg-[#01142B] rounded-2xl shadow-2xl relative overflow-hidden select-none border border-[#C5A059]/20"
            >
              {imageSrc ? (
                /* User Photo Layer with Interactive transforms */
                <div 
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleMouseUp}
                  className="absolute inset-0 cursor-move overflow-hidden flex items-center justify-center bg-white"
                >
                  <div 
                    style={{
                      transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg) scale(${zoom})`,
                      transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                    }}
                    className="w-full h-full flex items-center justify-center pointer-events-none"
                  >
                    <img 
                      src={imageSrc} 
                      alt="UET Graduate Preview" 
                      className="max-w-none w-full h-full object-cover pointer-events-none"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              ) : (
                /* Placeholder Empty state */
                <div 
                  onClick={triggerFileInput}
                  className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-[#01142B] to-[#002147] group"
                >
                  <div className="w-16 h-16 rounded-full bg-[#C5A059]/10 group-hover:bg-[#C5A059]/20 transition-colors flex items-center justify-center text-[#C5A059]">
                    <Camera className="w-8 h-8" />
                  </div>
                  <span className="font-serif text-sm font-bold text-[#C5A059] tracking-wide">Nhấp để tải ảnh chân dung</span>
                  <span className="font-serif text-xs text-slate-400">Hỗ trợ JPG, PNG, WEBP</span>
                </div>
              )}

              {/* OVERLAY FRAME (HTML representation for accurate live rendering) */}
              <div className="absolute inset-0 pointer-events-none border-[18px] border-double border-transparent flex flex-col justify-between">
                
                {/* Thick outer framing representing active selected frame */}
                <div className={`absolute inset-0 border-[20px] ${activeFrame.borderColor} opacity-100`}></div>
                
                {/* Colored framing block background (Top and Bottom only) */}
                <div className={`absolute top-0 inset-x-0 h-6 ${activeFrame.bgColor}`}></div>
                <div className={`absolute bottom-0 inset-x-0 h-16 ${activeFrame.bgColor}`}></div>

                {/* School Crest Badge (Top centered) */}
                <div className="absolute top-2 inset-x-0 flex justify-center">
                  <div className="w-9 h-9 rounded-full bg-[#002147] border border-[#C5A059] flex items-center justify-center shadow-md">
                    <span className="font-serif text-[10px] font-black text-[#C5A059]">UET</span>
                  </div>
                </div>

                {/* Header text space underneath badge */}
                <div className="absolute top-11 inset-x-0 text-center">
                  <span className="text-[9px] font-sans text-white/50 tracking-widest uppercase">Trường Đại học Công nghệ</span>
                </div>

                {/* Bottom Text Overlays inside the frame */}
                <div className="absolute bottom-2 inset-x-0 text-center flex flex-col justify-center items-center px-4">
                  <span 
                    style={{ color: activeFrame.accentColor }}
                    className="font-serif text-sm font-bold tracking-wider leading-none mb-1 uppercase"
                  >
                    {activeFrame.overlayText}
                  </span>
                  <span className="font-serif text-[10px] text-slate-100 italic">
                    {activeFrame.subText}
                  </span>
                </div>
              </div>
            </div>

            {/* Hidden canvas used for high resolution rendering on download */}
            <canvas ref={canvasRef} className="hidden" />

            <div className="mt-8 flex flex-col items-center gap-4 w-full max-w-sm">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                id="photobooth-file-input"
                onChange={handleImageUpload}
                className="hidden"
              />

              {imageSrc ? (
                <button
                  type="button"
                  id="btn-download-frame"
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="w-full bg-[#C5A059] hover:bg-[#B38F46] disabled:bg-slate-600 text-[#002147] font-serif font-bold py-3.5 px-6 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 text-base uppercase tracking-wider"
                >
                  <Download className="w-5 h-5 animate-bounce" /> {isGenerating ? 'Đang tạo hình...' : 'Tải Khung Ảnh Về Máy'}
                </button>
              ) : (
                <button
                  type="button"
                  id="btn-trigger-upload"
                  onClick={triggerFileInput}
                  className="w-full bg-[#C5A059] hover:bg-[#B38F46] text-[#002147] font-serif font-bold py-3.5 px-6 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 text-base uppercase tracking-wider"
                >
                  <Upload className="w-5 h-5" /> Tải Ảnh Lên Điểm Danh
                </button>
              )}
              
              <p className="text-center font-serif text-xs text-slate-400 max-w-xs leading-relaxed">
                Sau khi tải ảnh lên, bạn có thể tự do phóng to, xoay góc hoặc di chuyển ảnh để khớp nhất với khung hình kỷ niệm của UET.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
