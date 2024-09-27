import { useAppContext } from '@/contexts/app-provider';
import { ConnectButton, useSIWOP } from '@otherpage/connect';
import { SIWOPButton } from '@otherpage/connect';
import { useEffect, useState } from 'react';
// import { Unity, useUnityContext } from "react-unity-webgl";

export default function Home({ address }: { address?: string }) {
  const { toggleMode, handleSetPrimaryColor, mode, primaryColor } =
    useAppContext();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSetPrimaryColor(e.target.value as `#${string}`);
  };
  const { appUrl, clientId, isSignedIn } = useSIWOP();

  const openAccount = () => {
    const left = (window.innerWidth / 2) - 400;
    const top = (window.innerHeight / 2) - 380;
    window.open(`${appUrl}/connect/settings?client_id=${clientId}`, "mozillaWindow", `left=${left},top=${top},width=800,height=760`)
  };

  return (
    <main className="flex min-h-[calc(100vh-100px)] w-screen relative flex-col">
      <div className="flex justify-between bg-black p-4">
        <img className="w-10" src="https://cdn-icons-png.freepik.com/512/16440/16440737.png" />
        <div className="flex items-center">
        <ConnectButton />
        {isSignedIn && <button className="bg-neutral-900 text-white rounded-md p-3 ml-1 text-sm" onClick={openAccount}>
          Account
          </button>}
        </div>
      </div>
      <div className="flex flex-col gap-2 absolute items-start left-10 top-24">
        <button
          onClick={toggleMode}
          className="shadow border p-2 rounded-md bg-slate-300"
        >
          Mode: {mode}
        </button>
        <div className="flex items-center gap-2">
          <label htmlFor="color">Primary Color:</label>
          <input
            type="color"
            className="cursor-pointer"
            id="color"
            value={primaryColor}
            onChange={handleColorChange}
          />
        </div>
      </div>
      <div className="flex items-center justify-center min-h-screen w-screen">
        <div className="h-[400px] w-full rounded-lg flex justify-center items-center flex-col">
            <div className="text-lg mb-6 font-medium">
              <SIWOPButton />
            </div>
        </div>
      </div>
    </main>
  );
}
