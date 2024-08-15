import { useAppContext } from '@/contexts/app-provider';
import { ConnectButton, useSIWE } from 'opconnect';

export default function Home({ address }: { address?: string }) {
  const { toggleMode, handleSetPrimaryColor, mode, primaryColor } =
    useAppContext();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSetPrimaryColor(e.target.value as `#${string}`);
  };
  const { data, isSignedIn, signOut, signIn } = useSIWE();

  return (
    <main className="flex min-h-screen w-screen justify-center items-center relative">
      <div className="flex flex-col gap-2 absolute items-start left-10 top-10">
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
      <ConnectButton />
    </main>
  );
}
