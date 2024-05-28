import type { NextPage } from 'next';
import { OPConnectButton } from 'opconnect';

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
      <OPConnectButton />
    </div>
  );
};

export default Home;
