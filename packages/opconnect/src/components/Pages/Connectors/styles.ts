import styled from '../../../styles/styled';
import { keyframes } from 'styled-components';

import { motion } from 'framer-motion';
import { ModalBody } from '../../Common/Modal/styles';
import defaultTheme from '../../../constants/defaultTheme';

const Shimmer = keyframes`
  0%{ transform: translate(-100%) rotate(-45deg); }
  100%{ transform: translate(100%) rotate(-80deg); }
`;

export const ConnectorWrapper = styled.div`
  display: flex;
  gap: 20px;
  justify-content: space-between;
`;

export const InfoBox = styled.div`
  padding: 24px 24px 28px;
  border-radius: var(--ck-tertiary-border-radius, 24px);
  box-shadow: var(--ck-tertiary-box-shadow, none);
  background: var(--ck-body-background-tertiary);
  ${ModalBody} {
    max-width: none;
  }
`;
export const InfoBoxButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 5px -8px -12px;
  button {
  }
`;
export const LearnMoreContainer = styled(motion.div)`
  text-align: center;
`;
export const LearnMoreButton = styled(motion.button)`
  appearance: none;
  user-select: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 42px;
  padding: 0 16px;
  border-radius: 6px;
  background: none;
  color: var(--ck-body-color-muted);
  font-size: 15px;
  line-height: 18px;
  font-weight: 500;
  /* will-change: transform; */
  transition: color 100ms ease, transform 100ms ease;
  svg {
    transition: all 100ms ease-out;
  }
  &:hover {
    color: var(--ck-body-color-muted-hover);
    svg {
      path,
      circle {
        opacity: 1;
        transform: none;
      }
    }
  }
  &:active {
    transform: scale(0.96);
  }
`;

export const DontSeeWalletButton = styled(motion.button)`
  appearance: none;
  user-select: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 42px;
  padding: 0 16px;
  border-radius: 6px;
  background: none;
  color: var(--ck-body-color-muted);
  font-size: 15px;
  line-height: 18px;
  font-weight: 500;
  /* will-change: transform; */
  transition: color 100ms ease, transform 100ms ease;
  svg {
    transition: all 100ms ease-out;
    width: 22px;
    height: 22px;
    path {
      fill: var(--ck-body-color-muted);
    }
  }
  &:hover {
    svg {
      path,
      circle {
        color: var(--ck-body-color-muted-hover);
        opacity: 1;
        transform: none;
      }
    }
  }
  &:active {
    transform: scale(0.96);
  }
`;

export const ConnectorsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 0 16px;
  overflow-y: scroll;
  max-height: 20rem;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ConnectorButton = styled(motion.button)`
  cursor: pointer;
  user-select: none;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 20px;
  width: 100%;
  height: 45px;
  font-size: 17px;
  font-weight: var(--ck-primary-button-font-weight, 500);
  line-height: 20px;
  text-align: var(--ck-body-button-text-align, left);
  transition: 180ms ease;
  transition-property: background, color, box-shadow, transform, opacity;
  will-change: transform, box-shadow, background-color, color, opacity;

  --fallback-color: var(--ck-primary-button-color);
  --fallback-background: var(--ck-primary-button-background);
  --fallback-box-shadow: var(--ck-primary-button-box-shadow);
  --fallback-border-radius: var(--ck-primary-button-border-radius);

  --color: var(--ck-primary-button-color, var(--fallback-color));
  --background: var(--ck-primary-button-background, var(--fallback-background));
  --box-shadow: var(--ck-primary-button-box-shadow, var(--fallback-box-shadow));
  --border-radius: var(
    --ck-primary-button-border-radius,
    var(--fallback-border-radius)
  );

  --hover-color: var(--ck-primary-button-hover-color, var(--color));
  --hover-background: var(
    --ck-primary-button-hover-background,
    var(--background)
  );
  --hover-box-shadow: var(
    --ck-primary-button-hover-box-shadow,
    var(--box-shadow)
  );
  --hover-border-radius: var(
    --ck-primary-button-hover-border-radius,
    var(--border-radius)
  );

  --active-color: var(--ck-primary-button-active-color, var(--hover-color));
  --active-background: var(
    --ck-primary-button-active-background,
    var(--hover-background)
  );
  --active-box-shadow: var(
    --ck-primary-button-active-box-shadow,
    var(--hover-box-shadow)
  );
  --active-border-radius: var(
    --ck-primary-button-active-border-radius,
    var(--hover-border-radius)
  );

  color: var(--color);
  background: var(--background);
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);

  &:disabled {
    transition: 180ms ease;
    opacity: 0.4;
  }

  --bg: var(--background);
  &:not(:disabled) {
    &:hover {
      color: var(--hover-color);
      background: var(--hover-background);
      box-shadow: var(--hover-box-shadow);
      border-radius: var(--hover-border-radius);
      --bg: var(--hover-background, var(--background));
    }
    &:focus-visible {
      transition-duration: 100ms;
      color: var(--hover-color);
      background: var(--hover-background);
      box-shadow: var(--hover-box-shadow);
      border-radius: var(--hover-border-radius);
      --bg: var(--hover-background, var(--background));
    }
    &:active {
      color: var(--active-color);
      background: var(--active-background);
      box-shadow: var(--active-box-shadow);
      border-radius: var(--active-border-radius);
      --bg: var(--active-background, var(--background));
    }
  }
`;
export const ConnectorRecentlyUsed = styled(motion.span)`
  position: relative;
  top: var(--ck-recent-badge-top-offset, 0.5px);
  display: inline-block;
  padding: 10px 7px;
  line-height: 0;
  font-size: 13px;
  font-weight: 400;
  border-radius: var(--ck-recent-badge-border-radius, var(--border-radius));
  color: var(
    --ck-recent-badge-color,
    var(--ck-accent-color, var(--ck-body-color-muted, currentColor))
  );
  background: var(--ck-recent-badge-background, transparent);
  overflow: hidden;
  span {
    display: inline-block;
    position: relative;
  }
  &:before {
    z-index: 1;
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.4;
    box-shadow: var(--ck-recent-badge-box-shadow, inset 0 0 0 1px currentColor);
    border-radius: inherit;
  }
  &:after {
    z-index: 2;
    content: '';
    position: absolute;
    inset: -10%;
    top: -110%;
    aspect-ratio: 1/1;
    opacity: 0.7;
    background: linear-gradient(
      170deg,
      transparent 10%,
      var(--ck-recent-badge-background, var(--bg)) 50%,
      transparent 90%
    );
    animation: ${Shimmer} 2s linear infinite;
  }
`;

export const ConnectorLabel = styled(motion.span)`
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 2px 0;
  padding-right: 38px;
`;

export const ConnectorIcon = styled(motion.div)`
  width: 32px;
  height: 32px;
  overflow: hidden;
  svg,
  img {
    display: block;
    position: relative;
    pointer-events: none;
    overflow: hidden;
    border-radius: 27.5%;
    width: 100%;
    height: 100%;
  }
`;

export const ConnectContainer = styled.div`
  display: flex;
  flex-direction: column;
  paddingleft: 16px;
  width: 362px;
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    width: 100%;
  }
`;

export const QRConnectContainer = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #eaedf0;
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    gap: 4px;
  }
`;

export const WalletNameContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  font-size: 16px;
  font-weight: var(--ck-modal-heading-font-weight, 800);
  color: #000000;
  margin-bottom: 12px;
  text-transform: uppercase;
`;

export const CustomQRCodeContainer = styled.div`
  height: 312px;
  width: 310px;
  margin-bottom: 8px;
  border-radius: var(--ck-qr-border-radius, 24px);
  background-color: var(--ck-custom-qr-code-background);
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    margin: 0 auto;
    max-height: 252px;
    max-width: 250px;
    height: 100%;
    width: 100%;
    margin-bottom: 10px;
  }
`;

export const OrContainer = styled.p`
  font-weight: var(--ck-modal-heading-font-weight, 800);
  font-size: 8px;
  text-align: center;
  color: #000000;
`;

export const DesktopConnectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: space-between;
`;
