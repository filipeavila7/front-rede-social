import { useEffect, useState } from "react";

const scrollPositions = {};

function useScrollPosition(pageKey) {
  const [isScrollReady, setIsScrollReady] = useState(() => !scrollPositions[pageKey]);

  useEffect(() => {
    const savedPosition = scrollPositions[pageKey];
    let timeoutId;

    if (savedPosition) {
      setIsScrollReady(false);

      timeoutId = window.setTimeout(() => {
        window.scrollTo(0, savedPosition);
        setIsScrollReady(true);
      }, 100);
    } else {
      setIsScrollReady(true);
    }

    const savePosition = () => {
      scrollPositions[pageKey] = window.scrollY;
    };

    window.addEventListener("scroll", savePosition);

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      window.removeEventListener("scroll", savePosition);
    };
  }, [pageKey]);

  return isScrollReady;
}

export default useScrollPosition;
