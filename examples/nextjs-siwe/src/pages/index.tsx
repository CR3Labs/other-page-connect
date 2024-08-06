import { useAppContext } from '@/contexts/app-provider';
import { OPConnectButton, useSIWE } from 'opconnect';
import { use, useEffect, useState } from 'react';
// import { Unity, useUnityContext } from "react-unity-webgl";

export default function Home({ address }: { address?: string }) {
  const [connected, setConnected] = useState(false);
  const { toggleMode, handleSetPrimaryColor, mode, primaryColor } =
    useAppContext();

    

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSetPrimaryColor(e.target.value as `#${string}`);
  };
  const { data, isSignedIn, signOut, signIn } = useSIWE();
  console.log({ data, isSignedIn, signOut, signIn });

  const openAccount = () => {
    const left = (window.innerWidth / 2) - 400;
    const top = (window.innerHeight / 2) - 380;
    const clientId = '019f608c-04c6-4568-b4d1-8e6ee24789b2';
    window.open(`http://127.0.0.1:3001/connect/settings?client_id=${clientId}`, "mozillaWindow", `left=${left},top=${top},width=800,height=760`)
  };

  useEffect(() => {
    if (window) {
      setConnected(window?.location?.search?.includes('code'));
    }
  }, []);

  // const { unityProvider } = useUnityContext({
  //   loaderUrl: "build/myunityapp.loader.js",
  //   dataUrl: "build/myunityapp.data",
  //   frameworkUrl: "build/myunityapp.framework.js",
  //   codeUrl: "build/myunityapp.wasm",
  // });

  return (
    <main className="flex min-h-[calc(100vh-100px)] w-screen relative flex-col">
      <div className="flex justify-between bg-black p-4">
        <img className="w-20" src="https://media.10ktf.com/static/images/10ktf-logo.png" />
        <div className="flex items-center">
        <OPConnectButton />
        {connected && <button className="bg-neutral-900 text-white rounded-md p-3 ml-1 text-sm" onClick={openAccount}>
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
            {/* <Unity unityProvider={unityProvider} /> */}
            <div className="text-lg mb-6 font-medium">Game</div>
        </div>
      </div>
    </main>
  );
}
