import { useAppContext } from '@/contexts/app-provider';
import { OPConnectButton, useSIWE } from 'opconnect';

export default function Home({ address }: { address?: string }) {
  const { toggleMode, handleSetPrimaryColor, mode, primaryColor } =
    useAppContext();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSetPrimaryColor(e.target.value as `#${string}`);
  };
  const { data, isSignedIn, signOut, signIn } = useSIWE();
  console.log({ data, isSignedIn, signOut, signIn });
  return (
    <main className="flex min-h-screen w-screen justify-between items-center relative flex-col">
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
      <div className="max-w-[160px] rounded-lg overflow-hidden m-4">
        <img src="https://t4.ftcdn.net/jpg/03/19/48/29/360_F_319482962_SDPCBHu8vANPFII8M7V8PHna0QNMnlf6.jpg" />
      </div>
      <div className="size-[200px] bg-neutral-200 rounded-lg flex justify-center items-center flex-col">
        <div className="text-lg mb-6 font-medium">Connect Demo</div>
        <OPConnectButton />
      </div>
      
      <div>
        Demo Game, Inc.
      </div>
    </main>
  );
}
