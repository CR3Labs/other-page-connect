import React, { useState, useEffect, useRef } from 'react';

import { EnsAvatar, ImageContainer } from './styles';

import { useEnsName, useEnsAvatar, useEnsAddress } from 'wagmi';
import { normalize } from 'viem/ens';
import { ResetContainer } from '../../../styles';
import { useContext } from '../../ConnectKit';
import useIsMounted from '../../../hooks/useIsMounted';
import { useEnsFallbackConfig } from '../../../hooks/useEnsFallbackConfig';

type Hash = `0x${string}`;

export type CustomAvatarProps = {
  address?: Hash | undefined;
  ensName?: string | undefined;
  ensImage?: string;
  width: number | string;
  height: number | string;
  radius: number;
};

const Avatar: React.FC<{
  address?: Hash | undefined;
  name?: string | undefined;
  width?: number | string;
  height?: number | string;
  radius?: number;
}> = ({ address, name, width = 96, height = 96, radius = 4 }) => {
  const isMounted = useIsMounted();
  const context = useContext();

  const imageRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(true);

  const ensFallbackConfig = useEnsFallbackConfig();
  const { data: ensAddress } = useEnsAddress({
    chainId: 1,
    name: name,
    config: ensFallbackConfig,
  });
  const { data: ensName } = useEnsName({
    chainId: 1,
    address: address ?? ensAddress ?? undefined,
    config: ensFallbackConfig,
  });
  const { data: ensAvatar } = useEnsAvatar({
    chainId: 1,
    name: normalize(ensName ?? ''),
    config: ensFallbackConfig,
  });

  const ens = {
    address: ensAddress ?? address,
    name: ensName ?? name,
    avatar: ensAvatar ?? undefined,
  };

  useEffect(() => {
    if (
      !(
        imageRef.current &&
        imageRef.current.complete &&
        imageRef.current.naturalHeight !== 0
      )
    ) {
      setLoaded(false);
    }
  }, [ensAvatar]);

  if (!isMounted)
    return <div style={{ width, height, borderRadius: radius }} />;

  if (context.options?.customAvatar)
    return (
      <div
        style={{
          width,
          height,
          borderRadius: radius,
          overflow: 'hidden',
        }}
      >
        {context.options?.customAvatar({
          address: address ?? ens?.address,
          ensName: name ?? ens?.name,
          ensImage: ens?.avatar,
          width,
          height,
          radius,
        })}
      </div>
    );

  if (!ens.name || !ens.avatar)
    return (
      <ResetContainer style={{ pointerEvents: 'none' }}>
        <EnsAvatar
          $width={width}
          $height={height}
          $seed={ens.address}
          $radius={radius}
        />
      </ResetContainer>
    );
  return (
    <ResetContainer style={{ pointerEvents: 'none' }}>
      <EnsAvatar
        $width={width}
        $height={height}
        $seed={ens.address}
        $radius={radius}
      >
        <ImageContainer
          ref={imageRef}
          src={ens.avatar}
          alt={ens.name}
          onLoad={() => setLoaded(true)}
          $loaded={loaded}
        />
      </EnsAvatar>
    </ResetContainer>
  );
};

export default Avatar;
