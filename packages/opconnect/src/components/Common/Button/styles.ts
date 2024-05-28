import { motion } from 'framer-motion';
import styled from '../../../styles/styled';
import { css } from 'styled-components';
import defaultTheme from '../../../constants/defaultTheme';

export const SpinnerContainer = styled(motion.div)`
  position: absolute;
  right: 16px;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Arrow = styled.svg`
  --x: -3px;
  --stroke-width: 2;
  position: relative;
  top: 1px;
  left: -0.5px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 9px;
  margin-right: 1px;
  transition: all 100ms ease;
  transform: translateX(var(--x, -3px));
  color: currentColor;
  opacity: 0.4;
`;
export const ArrowChevron = styled.path``;
export const ArrowLine = styled.line`
  transition: inherit;
  transition-property: transform;
  transform-origin: 90% 50%;
  transform: scaleX(0.1);
`;
export const DownloadArrow = styled.div`
  display: inline-block;
  vertical-align: middle;
  position: relative;
  margin-right: 6px;
  color: currentColor;
`;
export const DownloadArrowInner = styled.div`
  transform: rotate(90deg);
  ${Arrow} {
    margin: 0 auto;
  }
`;

export const ButtonContainerInner = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  inset: 0;
  height: 100%;
`;
export const ButtonContainer = styled.button<{
  disabled?: boolean;
  $variant?: 'primary' | 'secondary' | 'tertiary';
}>`
  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
      pointer-events: none;
      ${InnerContainer} {
        opacity: 0.4;
      }
    `}

  ${({ $variant }) => {
    if ($variant === 'primary') {
      return css`
        --color: var(--ck-primary-button-color, var(--ck-body-color));
        --background: var(
          --ck-primary-button-background,
          var(--ck-body-background-primary)
        );
        --box-shadow: var(--ck-primary-button-box-shadow);
        --border-radius: var(--ck-primary-button-border-radius);
        --border-width: var(--ck-primary-button-border-width);
        --border-color: var(--ck-primary-button-border-color);
        --font-weight: var(--ck-primary-button-font-weight, 500);
        --font-size: var(--ck-primary-button-font-size);
        --line-height: var(--ck-primary-button-line-height);

        --hover-color: var(--ck-button-primary-hover-color, var(--color));
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
        --hover-font-weight: var(
          --ck-primary-button-font-weight,
          var(--font-weight)
        );
      `;
    } else if ($variant === 'secondary') {
      return css`
        --color: var(--ck-secondary-button-color, var(--ck-body-color));
        --background: var(
          --ck-secondary-button-background,
          var(--ck-body-background)
        );
        --box-shadow: var(--ck-secondary-button-box-shadow);
        --border-radius: var(--ck-secondary-button-border-radius);
        --border-width: var(--ck-secondary-button-border-width);
        --border-color: var(--ck-secondary-button-border-color);
        --font-weight: var(--ck-secondary-button-font-weight, 500);
        --font-size: var(--ck-secondary-button-font-size);
        --line-height: var(--ck-secondary-button-line-height);

        --hover-color: var(--ck-secondary-button-hover-color, var(--color));
        --hover-background: var(
          --ck-secondary-button-hover-background,
          var(--background)
        );
        --hover-box-shadow: var(
          --ck-secondary-button-hover-box-shadow,
          var(--box-shadow)
        );
        --hover-border-radius: var(
          --ck-secondary-button-hover-border-radius,
          var(--border-radius)
        );
        --hover-font-weight: var(
          --ck-secondary-button-font-weight,
          var(--font-weight)
        );
      `;
    } else if ($variant === 'tertiary') {
      return css`
        --color: var(
          --ck-tertiary-button-color,
          var(--ck-secondary-button-color)
        );
        --background: var(
          --ck-tertiary-button-background,
          var(--ck-secondary-button-background)
        );
        --box-shadow: var(
          --ck-tertiary-button-box-shadow,
          var(--ck-secondary-button-box-shadow)
        );
        --border-radius: var(
          --ck-tertiary-button-border-radius,
          var(--ck-secondary-button-border-radius)
        );
        --border-color: var(
          --ck-tertiary-button-border-color,
          var(--ck-secondary-button-border-color)
        );
        --border-width: var(
          --ck-tertiary-button-border-width,
          var(--ck-secondary-button-border-width)
        );
        --font-weight: var(
          --ck-tertiary-button-font-weight,
          var(--ck-secondary-button-font-weight)
        );
        --font-size: var(
          --ck-tertiary-button-font-size,
          var(--ck-secondary-button-font-size)
        );
        --line-height: var(
          --ck-tertiary-button-line-height,
          var(--ck-secondary-button-line-height)
        );

        --hover-color: var(
          --button-tertiary-hover-color,
          var(--ck-tertiary-button-color)
        );
        --hover-background: var(
          --ck-tertiary-button-hover-background,
          var(--ck-tertiary-button-background)
        );
        --hover-box-shadow: var(
          --ck-tertiary-button-hover-box-shadow,
          var(--ck-tertiary-button-box-shadow)
        );
        --hover-border-radius: var(
          --ck-tertiary-button-hover-border-radius,
          var(--ck-tertiary-button-border-radius, var(--border-radius))
        );
        --hover-font-weight: var(
          --ck-tertiary-button-font-weight,
          var(--ck-secondary-button-font-weight)
        );
      `;
    }
  }}

  appearance: none;
  cursor: pointer;
  user-select: none;
  min-width: fit-content;
  width: 100%;
  display: block;
  text-align: center;
  height: 45px;
  margin: 10px 0 0;
  line-height: var(--line-height);
  padding: 0 4px;
  font-size: var(--font-size);
  font-weight: var(--font-weight, 500);
  text-decoration: none;
  white-space: nowrap;
  transition: 100ms ease;
  transition-property: box-shadow, background-color;
  color: var(--color);
  background: var(--background);
  border-width: var(--border-width);
  border-style: solid;
  border-color: var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  will-change: transform, box-shadow, background-color, color;

  ${DownloadArrow} {
    ${Arrow} {
      transform: translateX(0);
      ${ArrowLine} {
        transform: none;
      }
      ${ArrowChevron} {
      }
    }
  }

  @media only screen and (min-width: ${defaultTheme.mobileWidth + 1}px) {
    &:hover,
    &:focus-visible {
      color: var(--ck-accent-text-color, var(--hover-color));
      background: var(--ck-accent-color, var(--hover-background));
      border-radius: var(--hover-border-radius);
      box-shadow: var(--hover-box-shadow);

      ${Arrow} {
        transform: translateX(0);
        ${ArrowLine} {
          transform: none;
        }
        ${ArrowChevron} {
        }
      }
      ${DownloadArrow} {
        ${Arrow} {
          transform: translateX(var(--x));
          ${ArrowLine} {
            transform: scaleX(0.1);
          }
          ${ArrowChevron} {
          }
        }
      }
    }
    &:active {
      box-shadow: var(
        --ck-secondary-button-active-box-shadow,
        var(--hover-box-shadow)
      );
    }
  }
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    transition: transform 100ms ease;
    transform: scale(1);
  }
`;

export const InnerContainer = styled.div`
  transform: translateZ(0); // Shifting fix
  position: relative;
  display: inline-block;
  vertical-align: middle;
  max-width: calc(100% - 42px);
  transition: opacity 300ms ease;
  /*
  overflow: hidden;
  text-overflow: ellipsis;
  */
`;

export const IconContainer = styled(motion.div)<{ $rounded?: boolean }>`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  max-width: 24px;
  max-height: 24px;
  margin: 0 10px;
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
  ${(props) => {
    return (
      props.$rounded &&
      css`
        overflow: hidden;
        border-radius: 5px;
      `
    );
  }}
  svg {
    display: block;
    position: relative;
    max-width: 100%;
    height: auto;
  }
`;
