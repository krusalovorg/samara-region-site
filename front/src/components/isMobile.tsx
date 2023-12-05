import React, { useEffect, useState } from 'react';

type IsMobileCallback = (isMobile: boolean) => void;

export default function useIsMobile(callback?: IsMobileCallback) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      if (mobile !== isMobile) {
        setIsMobile(mobile);
        if (callback) {
          callback(mobile);
        }
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile, callback]);

  return isMobile;
}
