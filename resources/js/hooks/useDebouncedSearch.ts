import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

type Options = {
  route: string;
  searchProp: string | null | undefined;
  delay?: number;
  extraParams?: Record<string, string | number>;
  onBeforeNavigate?: () => void;
};

export function useDebouncedSearch({
  route,
  searchProp,
  delay = 300,
  extraParams,
  onBeforeNavigate,
}: Options) {
  const [searchTerm, setSearchTerm] = useState(searchProp ?? '');

  const serializedExtraParams = JSON.stringify(extraParams ?? {});

  useEffect(() => {
    const timeout = setTimeout(() => {
      if ((searchTerm || '') === (searchProp || '')) return;

      onBeforeNavigate?.();

      const params: Record<string, string | number> = {};
      if (searchTerm) {
        params.search = searchTerm;
        params.page = 1;
      }
      const parsed = JSON.parse(serializedExtraParams) as Record<string, string | number> | null;
      if (parsed && Object.keys(parsed).length > 0) Object.assign(params, parsed);

      router.get(route, params, {
        preserveState: true,
        replace: true,
      });
    }, delay);

    return () => clearTimeout(timeout);
  }, [route, searchTerm, searchProp, delay, serializedExtraParams, onBeforeNavigate]);

  return { searchTerm, setSearchTerm };
}
