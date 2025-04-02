import { useEffect, useRef } from 'react';

export const useOutsideClick = (callback, addEventListener=true) => {
  const ref = useRef();
  
  useEffect(() => {
    const handleClick = (event) => {
      if (ref?.current && !ref?.current?.contains(event?.target)) {
        callback(true);
      }
    };
  
    if (addEventListener) {
      document?.addEventListener('click', handleClick);
    }
  
    return () => {
      document?.removeEventListener('click', handleClick, true);
    };
  }, [ref]);
  
  return ref;
};