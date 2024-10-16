import { useEffect, useState } from "react";

export default function useQueryParams() {
  const [queryParams, setQueryParams] = useState(() =>
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  );

  useEffect(() => {
    const handleUrlChange = () => {
      setQueryParams(new URLSearchParams(window.location.search));
    };

    // Monkey-patch pushState and replaceState to fire events
    const patchHistoryMethod = (method: 'pushState' | 'replaceState') => {
      const original = history[method];
      return function (this: History, ...args: any) {
        const result = original.apply(this, args);
        window.dispatchEvent(new Event('locationchange'));
        return result;
      };
    };

    history.pushState = patchHistoryMethod('pushState');
    history.replaceState = patchHistoryMethod('replaceState');

    // Listen to popstate and our custom locationchange event
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('locationchange', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('locationchange', handleUrlChange);
    };
  }, []);

  return queryParams;
};