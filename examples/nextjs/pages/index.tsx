import type { NextPage } from 'next';
import { ConnectButton } from '@otherpage/connect';

const Home: NextPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <ConnectButton />
    </div>
  );
};

export default Home;
