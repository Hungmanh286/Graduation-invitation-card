/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import Countdown from './components/Countdown';
import InvitationCard from './components/InvitationCard';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [location, setLocation] = useState(() => ({
    pathname: window.location.pathname,
    search: window.location.search,
  }));

  useEffect(() => {
    const handleRouteChange = () => {
      setLocation({
        pathname: window.location.pathname,
        search: window.location.search,
      });
    };

    window.addEventListener('popstate', handleRouteChange);

    if (window.location.pathname !== '/home') {
      window.history.replaceState(null, '', `/home${window.location.search}`);
      handleRouteChange();
    }

    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const guestParam = new URLSearchParams(location.search).get('guest') || '';
  const isDetailsPage = location.pathname === '/home' && guestParam.endsWith('/details');

  return (
    <div className="min-h-screen bg-[#ECE9E2] text-slate-800 flex flex-col relative justify-center">
      
      {/* Background Classical Ambient Synthesizer */}
      <MusicPlayer />

      {/* MAIN DYNAMIC CONTENT COMPONENT SECTIONS */}
      <main className="flex-1 flex flex-col justify-center">
        {isDetailsPage ? (
          <InvitationCard view="details" />
        ) : (
          <div className="flex flex-col items-center gap-8 w-full pb-10 md:pb-14">
            <InvitationCard view="cover" />
            <div className="w-full max-w-2xl px-4 md:px-0">
              <Countdown />
            </div>
          </div>
        )}
      </main>

    </div>
  );
}
