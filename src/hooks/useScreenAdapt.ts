import { useState, useEffect, useCallback } from 'react';
import { getScreenScale, debounce } from '@/utils/screen';
import { DESIGN_SIZE } from '@/constants/theme';
import { logger } from '@/logger';

export function useScreenAdapt() {
  const [scale, setScale] = useState(() => getScreenScale());

  const handleResize = useCallback(
    debounce(() => {
      const s = getScreenScale();
      setScale(s);
      logger.perf('screenAdapt', s);
    }, 200),
    [],
  );

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return {
    scale,
    containerStyle: {
      width: DESIGN_SIZE.width,
      height: DESIGN_SIZE.height,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      position: 'absolute' as const,
      top: 0,
      left: 0,
    },
  };
}