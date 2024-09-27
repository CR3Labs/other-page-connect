import React from 'react';
import useFitText from '../../hooks/useFitText';

const FitText = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  const [ready, setReady] = React.useState(false);
  const { fontSize, ref: textRef } = useFitText({
    logLevel: 'none',
    maxFontSize: 100,
    minFontSize: 70,
    onStart: () => setReady(true),
    onFinish: () => setReady(true),
  });
  return (
    <div
      ref={textRef}
      style={{
        visibility: ready ? 'visible' : 'hidden',
        fontSize: `${fontSize}%`,
        maxHeight: '100%',
        maxWidth: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
FitText.displayName = 'FitText';

export default FitText;
