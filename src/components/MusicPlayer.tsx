/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Music } from 'lucide-react';

const GRADUATION_MUSIC_SRC = '/audio/hitslab-graduation-university-college-music-292747.mp3';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.45;
    try {
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      playMusic();
    }
  };

  useEffect(() => {
    const handleCardOpened = () => {
      if (!isPlaying) {
        playMusic();
      }
    };

    window.addEventListener('graduation-card-opened', handleCardOpened);

    return () => {
      window.removeEventListener('graduation-card-opened', handleCardOpened);
    };
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.45;
    }

    return () => {
      audio?.pause();
    };
  }, []);

  return (
    <div 
      id="uet-music-player"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#002147]/95 border border-[#C5A059]/30 px-4 py-3 rounded-full shadow-xl shadow-amber-900/10 backdrop-blur-md transition-all duration-300 hover:scale-105"
    >
      <audio ref={audioRef} src={GRADUATION_MUSIC_SRC} loop preload="auto" />

      <div className="flex flex-col text-right">
        <p className="text-[10px] font-sans tracking-widest text-[#C5A059] uppercase">Giai điệu buổi lễ</p>
        <p className="text-xs font-serif font-semibold text-white">Graduation Music</p>
      </div>

      <button
        id="btn-toggle-music"
        onClick={togglePlay}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
          isPlaying 
            ? 'bg-[#C5A059] text-[#002147] animate-pulse' 
            : 'bg-[#01142B] text-[#C5A059] border border-[#C5A059]/30 hover:bg-[#C5A059] hover:text-[#002147]'
        }`}
        title={isPlaying ? "Tạm dừng nhạc" : "Phát nhạc khai mạc"}
      >
        {isPlaying ? (
          <div className="flex items-center gap-[2px]">
            <span className="w-[3px] h-3 bg-[#002147] rounded-full animate-[bounce_0.8s_infinite_100ms]"></span>
            <span className="w-[3px] h-4 bg-[#002147] rounded-full animate-[bounce_0.8s_infinite_300ms]"></span>
            <span className="w-[3px] h-2 bg-[#002147] rounded-full animate-[bounce_0.8s_infinite_500ms]"></span>
            <span className="w-[3px] h-5 bg-[#002147] rounded-full animate-[bounce_0.8s_infinite_200ms]"></span>
          </div>
        ) : (
          <Music className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
