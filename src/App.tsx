/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import Countdown from './components/Countdown';
import InvitationCard from './components/InvitationCard';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [isCardOpened, setIsCardOpened] = useState(false);

  useEffect(() => {
    let hideCountdownTimer: number | undefined;
    const handleCardOpened = () => {
      hideCountdownTimer = window.setTimeout(() => setIsCardOpened(true), 420);
    };

    window.addEventListener('graduation-card-opened', handleCardOpened);

    if (window.location.pathname !== '/') {
      window.history.replaceState(null, '', `/${window.location.search}`);
    }

    return () => {
      window.removeEventListener('graduation-card-opened', handleCardOpened);
      window.clearTimeout(hideCountdownTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#ECE9E2] text-slate-800 flex flex-col relative justify-center">
      
      {/* Background Classical Ambient Synthesizer */}
      <MusicPlayer />

      {/* MAIN DYNAMIC CONTENT COMPONENT SECTIONS */}
      <main className="flex-1 flex flex-col justify-center">
        <div className="flex flex-col items-center gap-8 w-full pb-10 md:pb-14">
          <InvitationCard view="cover" />
          {!isCardOpened && (
            <div className="w-full max-w-2xl px-4 md:px-0">
              <Countdown />
            </div>
          )}
        </div>
      </main>

    </div>
  );
}
