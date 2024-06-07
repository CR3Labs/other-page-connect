import { keyframes } from 'styled-components';
import styled from '../../../styles/styled';
import { motion } from 'framer-motion';
import { ForceLightMode } from '../../../styles';
import defaultTheme from '../../../constants/defaultTheme';

export const AvatarContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
`;
export const ChainSelectorContainer = styled(motion.div)`
  z-index: 3;
  position: absolute;
  top: calc(50% + 7.5px);
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const BalanceContainer = styled(motion.div)`
  position: relative;
  color: var(--ck-body-color);
  font-weight: 600;
`;
export const Balance = styled(motion.div)`
  position: relative;
`;
const PlaceholderKeyframes = keyframes`
  0%{ background-position: 100% 0; }
  100%{ background-position: -100% 0; }
`;
export const LoadingBalance = styled(motion.div)`
  width: 25%;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  background: var(--ck-body-background-secondary);
  inset: 0;
  &:before {
    z-index: 4;
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(
      90deg,
      var(--ck-body-background-transparent) 50%,
      var(--ck-body-background),
      var(--ck-body-background-transparent)
    );
    opacity: 0.75;
    background-size: 200% 100%;
    animation: ${PlaceholderKeyframes} 1000ms linear infinite both;
  }
`;

export const InfoBox = styled(ForceLightMode)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 134px;
  background: var(--ck-body-background);
  color: var(--ck-body-color);
`;

export const Address = styled.h1`
  line-height: 32.78px;
  font-size: 24px;
  font-weight: 700;
`;
